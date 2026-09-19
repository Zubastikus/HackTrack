import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Participant } from './participant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private repo: Repository<Participant>,

  ) {}

  create(data: Partial<Participant>, user: any) {
    return this.repo.save({
      ...data,
      hackathon: { id: user.hackathonId },
    });
  }

  async findAll(filters: any, user: any) {

    const query = this.repo
      .createQueryBuilder('participant')
      .leftJoinAndSelect('participant.team', 'team')
      .leftJoin('participant.hackathon', 'hackathon')
      .andWhere('hackathon.id = :hackathonId', {
        hackathonId: user.hackathonId,
      });

    // фильтр по команде
    if (filters.team) {
      query.andWhere('team.name = :team', { team: filters.team });
    }

    // без команды (одиночки)
    if (filters.noTeam === 'true') {
      query.andWhere('participant.team IS NULL');
    }

    // по роли
    if (filters.role) {
      query.andWhere('participant.role = :role', { role: filters.role });
    }

    // поиск по имени
    if (filters.search) {
      query.andWhere(
        '(participant.firstName LIKE :search OR participant.lastName LIKE :search OR participant.middleName LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    return query.getMany();
  }

  async update(id: number, data: Partial<Participant>, user: any) {
    return this.repo.update(
      { 
        id,
        hackathon: { id: user.hackathonId }
      },
      data
    );
  }

  async remove(id: number, user: any) {
    return this.repo.delete({
      id,
      hackathon: { id: user.hackathonId },
    });
  }
  
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './team.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private repo: Repository<Team>,
  ) {}

  create(data: Partial<Team>, user: any) {
    return this.repo.save({
      ...data,
      hackathon: { id: user.hackathonId },
    });
  }

  async findAll(filters: any, user: any) {
  
    const query = this.repo
    .createQueryBuilder('team')
    .leftJoinAndSelect('team.track', 'track')
    .leftJoin('team.hackathon', 'hackathon')
    .andWhere('hackathon.id = :hackathonId', {
      hackathonId: user.hackathonId,
    });

    // фильтрация по треку
    if (filters.track) {
      query.andWhere('track.name = :track', { track: filters.track });
    }

    // фильтрация по типу проекта
    if (filters.type) {
      query.andWhere('team.type = :type', { type: filters.type });
    }

    // поиск по названию
    if (filters.search) {
      query.andWhere('team.name LIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    return query.getMany();
  }

  async update(id: number, data: Partial<Team>, user: any) {
    return this.repo.update(
      { id, hackathon: { id: user.hackathonId } },
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
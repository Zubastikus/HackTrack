import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './contact.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private repo: Repository<Contact>,
  ) {}

  create(data: Partial<Contact>, user: any) {
    return this.repo.save({
      ...data,
      hackathon: { id: user.hackathonId },
    });
  }

  async findAll(filters: any, user: any) {
    const query = this.repo
      .createQueryBuilder('contact')
      .leftJoin('contact.hackathon', 'hackathon')
      .andWhere('hackathon.id = :hackathonId', {
        hackathonId: user.hackathonId,
      });

    // поиск по имени
    if (filters.search) {
      query.andWhere('contact.fullName LIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    if (filters.responsibleFor) {
      query.andWhere('contact.responsibleFor LIKE :resp', {
        resp: `%${filters.responsibleFor}%`,
      });
    }

    return query.getMany();
  }

  async update(id: number, data: Partial<Contact>, user: any) {
    return this.repo.update(
      {
        id,
        hackathon: { id: user.hackathonId },
      },
      data,
    );
  }

  async remove(id: number, user: any) {
    return this.repo.delete({
      id,
      hackathon: { id: user.hackathonId },
    });
  }
}
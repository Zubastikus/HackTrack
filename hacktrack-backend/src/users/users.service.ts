import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  create(data: Partial<User>) {
    return this.repo.save(data);
  }

  async findAll(filters: any) {
    const query = this.repo.createQueryBuilder('user');

    // поиск по столбцу за что отвечает человек
    if (filters.responsibleFor) {
      query.andWhere('user.responsibleFor LIKE :resp', {
        resp: `%${filters.responsibleFor}%`,
      });
    }

    // поиск по имени
    if (filters.search) {
      query.andWhere('user.fullName LIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    return query.getMany();
  }
}
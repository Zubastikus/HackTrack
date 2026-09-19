import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hackathon } from './hackathon.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class HackathonsService {
  constructor(
    @InjectRepository(Hackathon)
    private hackathonRepo: Repository<Hackathon>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findAll(userId: number) {
    return this.hackathonRepo
      .createQueryBuilder('hackathon')
      .leftJoin('hackathon.users', 'user')
      .leftJoinAndSelect('hackathon.participants', 'participants')
      .leftJoinAndSelect('hackathon.teams', 'teams')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async findOne(id: number) {
    return this.hackathonRepo.findOne({
      where: { id },
      relations: ['users'],
    });
  }

  async create(data: Partial<Hackathon>, user: any) {
    const userEntity = await this.userRepo.findOne({
      where: { id: user.userId },
    });

    if (!userEntity) throw new Error('User not found');

    const hackathon = this.hackathonRepo.create({
      ...data,
      users: [userEntity],
    });

    return this.hackathonRepo.save(hackathon);
  }

  async update(id: number, data: Partial<Hackathon>, user: any) {
    const hackathon = await this.hackathonRepo.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!hackathon) {
      throw new Error('Hackathon not found');
    }

    const hasAccess = hackathon.users.some(u => u.id === user.userId);

    if (!hasAccess) {
      throw new Error('No access to this hackathon');
    }

    Object.assign(hackathon, data);

    return this.hackathonRepo.save(hackathon);
  }

  async remove(id: number, user: any) {
    const hackathon = await this.hackathonRepo.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!hackathon) {
      throw new Error('Hackathon not found');
    }

    const hasAccess = hackathon.users.some(u => u.id === user.userId);

    if (!hasAccess) {
      throw new Error('No access to this hackathon');
    }

    return this.hackathonRepo.remove(hackathon);
  }

  async addUserByEmail(hackathonId: number, email: string) {
    const hackathon = await this.hackathonRepo.findOne({
      where: { id: hackathonId },
      relations: ['users'],
    });

    if (!hackathon) throw new Error('Hackathon not found');

    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user) throw new Error('User not found');

    // уже есть?
    const exists = hackathon.users.some(u => u.id === user.id);
    if (exists) return hackathon;

    hackathon.users.push(user);

    return this.hackathonRepo.save(hackathon);
  }
}
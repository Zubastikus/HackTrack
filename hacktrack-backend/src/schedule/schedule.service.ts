import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './schedule.entity';
import { Repository } from 'typeorm';
import { Track } from '../tracks/track.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private repo: Repository<Schedule>,

    @InjectRepository(Track)
    private trackRepo: Repository<Track>,
  ) {}

  async create(data: any, user: any) {
    let track: Track | null = null;

    // 🔍 ищем трек по id (если передан)а
    if (data.track) {
      track = await this.trackRepo.findOne({
        where: { id: data.track },
      });
    }

    return this.repo.save({
      title: data.title,
      startTime: data.startTime,
      endTime: data.endTime,
      date: data.date,
      objective: data.objective,
      track: track || null,
      hackathon: { id: user.hackathonId },
    });
  }

  async findAll(filters: any, user: any) {
    const query = this.repo
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.track', 'track')
      .leftJoin('schedule.hackathon', 'hackathon')
      .andWhere('hackathon.id = :hackathonId', {
        hackathonId: user.hackathonId,
      });

    // 🔍 фильтр по треку
    if (filters.track) {
      query.andWhere('track.name = :track', { track: filters.track });
    }

    // 🔍 только общие (без трека)
    if (filters.common === 'true') {
      query.andWhere('schedule.track IS NULL');
    }

    // 🔍 сортировка
    query.orderBy('schedule.startTime', 'ASC');

    return query.getMany();
  }

  async update(id: number, data: any, user: any) {
    return this.repo.update(
      {
        id,
        hackathon: { id: user.hackathonId },
      },
      {
        ...data,
        track: data.track ? { id: data.track } : null,
        notifiedBefore: false,
        notifiedStart: false
      }
    );
  }

  async remove(id: number, user: any) {
    return this.repo.delete({
      id,
      hackathon: { id: user.hackathonId },
    });
  }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from './track.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private repo: Repository<Track>,

  ) {}

  create(data: Partial<Track>, user: any) {
    return this.repo.save({
      ...data,
      hackathon: { id: user.hackathonId },
    });
  }

  findAll(hackathonId: number) {
    return this.repo.find({
      where: {
        hackathon: { id: hackathonId },
      },
      relations: ['teams'],
    });
  }

  async update(id: number, data: Partial<Track>, user: any) {
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
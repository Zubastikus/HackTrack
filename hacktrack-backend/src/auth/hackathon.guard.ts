import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hackathon } from '../hackathons/hackathon.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HackathonGuard implements CanActivate {
  constructor(
    @InjectRepository(Hackathon)
    private hackathonRepo: Repository<Hackathon>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.hackathonId) {
      throw new ForbiddenException('Hackathon not selected');
    }

    const hackathon = await this.hackathonRepo
      .createQueryBuilder('hackathon')
      .leftJoin('hackathon.users', 'user')
      .where('hackathon.id = :id', { id: user.hackathonId })
      .andWhere('user.id = :userId', { userId: user.userId })
      .getOne();

    if (!hackathon) {
      throw new ForbiddenException('No access to this hackathon');
    }

    request.hackathon = hackathon;

    return true;
  }
}
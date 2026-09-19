import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hackathon } from './hackathon.entity';
import { HackathonsService } from './hackathons.service';
import { HackathonsController } from './hackathons.controller';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hackathon, User]), AuthModule],
  providers: [HackathonsService],
  controllers: [HackathonsController],
})
export class HackathonsModule {}
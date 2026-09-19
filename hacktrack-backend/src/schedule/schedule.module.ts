import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './schedule.entity';
import { AuthModule } from '../auth/auth.module';
import { Hackathon } from '../hackathons/hackathon.entity';
import { Track } from '../tracks/track.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Schedule, Hackathon, Track]),
      AuthModule,
      Hackathon,
    ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleTableModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from '../contacts/contact.entity';
import { Schedule } from '../schedule/schedule.entity';
import { TelegramModule } from '../telegram/telegram.module';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule, Contact]),
    TelegramModule,
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from '../schedule/schedule.entity';
import { Contact } from '../contacts/contact.entity';
import { Repository } from 'typeorm';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepo: Repository<Schedule>,

    @InjectRepository(Contact)
    private contactRepo: Repository<Contact>,

    private telegramService: TelegramService,
  ) {}

  @Cron('* * * * *') // каждую минуту
  async checkEvents() {
    const now = new Date();

    const events = await this.scheduleRepo.find({
      relations: ['hackathon', 'track'],
    });

    for (const e of events) {
      const start = this.parseDateTime(e.date, e.startTime);

      const diff = start.getTime() - now.getTime();

      // вычисление времени до начала события
      // за 30 минут
      if (
        diff > 0 &&
        diff <= 30 * 60 * 1000 &&
        !e.notifiedBefore
      ) {
        await this.sendReminder(e, 'before');

        e.notifiedBefore = true;
        await this.scheduleRepo.save(e);
      }

      // в момент начала
      if (
        diff <= 0 &&
        diff >= -60 * 1000 && // 1 минута окно
        !e.notifiedStart
      ) {
        await this.sendReminder(e, 'start');

        e.notifiedStart = true;
        await this.scheduleRepo.save(e);
      }
    }
  }

  async sendReminder(event: Schedule, type: 'before' | 'start') {
    const contacts = await this.contactRepo.find({
      where: {
        hackathon: { id: event.hackathon.id },
      },
    });

    for (const c of contacts) {
      if (!c.telegramId) continue;

      let text = '';

      const trackText = event.track
        ? `\nТрек: ${event.track.name}`
        : '';

      const objectiveText = event.objective
        ? `\nЗадача: ${event.objective}`
        : '';

      if (type === 'before') {
        text =
          `⏰ Через 30 минут:\n` +
          `${event.title}\n` +
          `${event.startTime}` +
          trackText +
          objectiveText;
      }

      if (type === 'start') {
        text =
          `🚀 Началось:\n` +
          `${event.title}` +
          trackText +
          objectiveText;
      }

      await this.telegramService.sendSystemMessage(
        Number(c.telegramId),
        text
      );
    }
  }

  // преобразование даты
  parseDateTime(date: string, time: string): Date {
    const [day, month] = date.split('.').map(Number);
    const [hours, minutes] = time.split(':').map(Number);

    const now = new Date();

    return new Date(
      now.getFullYear(),
      month - 1,
      day,
      hours,
      minutes
    );
  }
}
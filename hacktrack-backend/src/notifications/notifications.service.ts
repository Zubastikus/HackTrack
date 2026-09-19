import { Injectable } from '@nestjs/common';
import { Contact } from '../contacts/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Contact)
    private contactRepo: Repository<Contact>,
    private telegramService: TelegramService,
  ) {}

  async sendToHackathon(hackathonId: number, message: string) {
    const contacts = await this.contactRepo.find({
      where: {
        hackathon: { id: hackathonId },
        wantsOrganizerMessages: true,
      },
    });

    for (const c of contacts) {
      if (c.telegramId) {
        await this.telegramService.sendOrganizerMessage(
          Number(c.telegramId),
          message,
        );
      }
    }
  }
}
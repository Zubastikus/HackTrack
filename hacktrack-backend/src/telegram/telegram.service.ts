import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf, Markup } from 'telegraf';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../contacts/contact.entity';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Telegraf;
  private userStates = new Map<number, any>();

  constructor(
    @InjectRepository(Contact)
    private contactRepo: Repository<Contact>,
  ) {this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);}

  onModuleInit() {

    // START
    this.bot.start(async (ctx) => {
      this.userStates.set(ctx.from.id, { step: 'email' });
      ctx.reply('Введите email:');
    });

    // SETTINGS
    this.bot.command('settings', async (ctx) => {
      const contact = await this.contactRepo.findOne({
        where: { telegramId: String(ctx.from.id) },
        relations: ['hackathon'],
      });

      if (!contact) {
        return ctx.reply('Вы ещё не зарегистрированы. Напишите /start');
      }

      ctx.reply(
        `Хакатон: ${contact.hackathon.name}\n\nПолучать сообщения от организаторов?`,
        Markup.inlineKeyboard([
          [
            Markup.button.callback('✅ Включить', 'enable_notifications'),
            Markup.button.callback('❌ Выключить', 'disable_notifications'),
          ],
        ]),
      );
    });

    // TEXT HANDLER
    this.bot.on('text', async (ctx) => {
      const state = this.userStates.get(ctx.from.id);
      if (!state) return;

      // EMAIL
      if (state.step === 'email') {
        const email = ctx.message.text;

        const contacts = await this.contactRepo.find({
          where: { email },
          relations: ['hackathon'],
        });

        if (contacts.length === 0) {
          return ctx.reply('Контакт не найден');
        }

        // если один хакатон
        if (contacts.length === 1) {
          const contact = contacts[0];

          this.userStates.set(ctx.from.id, {
            step: 'confirm_notifications',
            contactId: contact.id,
          });

          await ctx.reply(
            `Вы подключены к хакатону: ${contact.hackathon.name}`
          );

          return ctx.reply(
            'Получать сообщения от организаторов?',
            Markup.inlineKeyboard([
              [
                Markup.button.callback('✅ Да', 'notify_yes'),
                Markup.button.callback('❌ Нет', 'notify_no'),
              ],
            ]),
          );
        }

        // если несколько хакатонов — выбор
        this.userStates.set(ctx.from.id, {
          step: 'select_hackathon',
          contacts,
        });

        return ctx.reply(
          'Выберите хакатон:',
          Markup.inlineKeyboard(
            contacts.map((c) => [
              Markup.button.callback(
                c.hackathon.name,
                `select_${c.id}`,
              ),
            ]),
          ),
        );
      }
    });

    // ВЫБОР ХАКАТОНА
    this.bot.action(/select_(.+)/, async (ctx) => {
      const contactId = Number(ctx.match[1]);

      this.userStates.set(ctx.from.id, {
        step: 'confirm_notifications',
        contactId,
      });

      await ctx.reply('Получать сообщения от организаторов?', {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✅ Да', callback_data: 'notify_yes' },
              { text: '❌ Нет', callback_data: 'notify_no' },
            ],
          ],
        },
      });
    });

    // включение рассылки
    this.bot.action('notify_yes', async (ctx) => {
      const state = this.userStates.get(ctx.from.id);
      if (!state) return;

      await this.contactRepo.update(state.contactId, {
        telegramId: String(ctx.from.id),
        wantsOrganizerMessages: true,
      });

      ctx.reply('Вы будете получать сообщения от организаторов 👍');
      ctx.reply('Вы будете получать напоминания о событиях ⏰');

      this.userStates.delete(ctx.from.id);
    });

    // выключение рассылки
    this.bot.action('notify_no', async (ctx) => {
      const state = this.userStates.get(ctx.from.id);
      if (!state) return;

      await this.contactRepo.update(state.contactId, {
        telegramId: String(ctx.from.id),
        wantsOrganizerMessages: false,
      });

      ctx.reply('Вы НЕ будете получать сообщения от организаторов');
      ctx.reply('Вы будете получать напоминания о событиях ⏰');

      this.userStates.delete(ctx.from.id);
    });

    // SETTINGS BUTTONS
    this.bot.action('enable_notifications', async (ctx) => {
      await this.contactRepo.update(
        { telegramId: String(ctx.from.id) },
        { wantsOrganizerMessages: true },
      );

      ctx.reply('Теперь вы получаете сообщения 👍');
    });

    this.bot.action('disable_notifications', async (ctx) => {
      await this.contactRepo.update(
        { telegramId: String(ctx.from.id) },
        { wantsOrganizerMessages: false },
      );

      ctx.reply('Вы отключили сообщения от организаторов');
    });

    this.bot.launch();
  }

  async sendOrganizerMessage(chatId: number, text: string) {
    return this.bot.telegram.sendMessage(
      chatId,
      `📢 Сообщение от организатора:\n\n${text}`
    );
  }

  async sendSystemMessage(chatId: number, text: string) {
    return this.bot.telegram.sendMessage(chatId, text);
  }
}
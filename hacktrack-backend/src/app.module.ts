import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantsModule } from './participants/participants.module';
import { TeamsModule } from './teams/teams.module';
import { TracksModule } from './tracks/tracks.module';
import { ScheduleTableModule } from './schedule/schedule.module';
import { UsersModule } from './users/users.module';
import { ImportModule } from './import/import.module';
import { HackathonsModule } from './hackathons/hackathons.module';
import { ContactsModule } from './contacts/contacts.module';
import { AuthModule } from './auth/auth.module';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationsModule } from './notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'hacktrack',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ParticipantsModule,
    TeamsModule,
    TracksModule,
    ScheduleTableModule,
    UsersModule,
    ImportModule,
    HackathonsModule,
    ContactsModule,
    AuthModule,
    TelegramModule,
    ConfigModule.forRoot(),
    NotificationsModule,
    ScheduleModule.forRoot(),
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

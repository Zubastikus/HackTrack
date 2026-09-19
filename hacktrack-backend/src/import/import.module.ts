import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { ImportController } from './import.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participant } from '../participants/participant.entity';
import { Team } from '../teams/team.entity';
import { Track } from '../tracks/track.entity';
import { User } from '../users/user.entity';
import { Contact } from '../contacts/contact.entity';
import { Schedule } from '../schedule/schedule.entity'; 
import { Hackathon } from '../hackathons/hackathon.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participant, Team, Track, User, Schedule, Contact, Hackathon]),
    AuthModule,
  ],
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule {}
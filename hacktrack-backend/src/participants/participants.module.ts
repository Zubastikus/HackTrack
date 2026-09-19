import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participant } from './participant.entity';
import { AuthModule } from '../auth/auth.module';
import { Hackathon } from '../hackathons/hackathon.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participant, Hackathon,]),
    AuthModule,
    Hackathon,
  ],
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
})
export class ParticipantsModule {}

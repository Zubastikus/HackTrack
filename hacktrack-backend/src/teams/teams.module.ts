import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './team.entity';
import { AuthModule } from '../auth/auth.module';
import { Hackathon } from '../hackathons/hackathon.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Team, Hackathon,]),
    AuthModule,
    Hackathon,
  ],
  providers: [TeamsService],
  controllers: [TeamsController]
})
export class TeamsModule {}


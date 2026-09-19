import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './track.entity';
import { AuthModule } from '../auth/auth.module';
import { Hackathon } from '../hackathons/hackathon.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Track, Hackathon,]),
    AuthModule,
    Hackathon,
  ],
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}
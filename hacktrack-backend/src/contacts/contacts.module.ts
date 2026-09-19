import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './contact.entity';
import { AuthModule } from '../auth/auth.module';
import { Hackathon } from '../hackathons/hackathon.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Contact, Hackathon,]),
      AuthModule,
      Hackathon,
    ],
  providers: [ContactsService],
  controllers: [ContactsController]
})
export class ContactsModule {}

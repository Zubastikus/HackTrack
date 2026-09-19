import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne  } from 'typeorm';
import { Track } from '../tracks/track.entity';
import { Hackathon } from '../hackathons/hackathon.entity';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column({ nullable: true })
  responsibleFor!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ nullable: true })
  organization!: string;

  @Column({ nullable: true })
  position!: string;

  @Column({ nullable: true })
  telegramId!: string;

  @Column({ default: false })
  wantsOrganizerMessages!: boolean;

  @ManyToOne(() => Hackathon, hackathon => hackathon.contacts, { nullable: false })
  hackathon!: Hackathon;
}
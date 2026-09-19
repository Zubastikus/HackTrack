import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../users/user.entity';
import { Contact } from '../contacts/contact.entity';
import { Team } from '../teams/team.entity';
import { Participant } from '../participants/participant.entity';
import { Track } from '../tracks/track.entity';
import { Schedule } from '../schedule/schedule.entity';

@Entity()
export class Hackathon {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @ManyToMany(() => User, user => user.hackathons)
  @JoinTable()
  users!: User[];

  @OneToMany(() => Team, team => team.hackathon)
  teams!: Team[];

  @OneToMany(() => Participant, p => p.hackathon)
  participants!: Participant[];

  @OneToMany(() => Track, t => t.hackathon)
  tracks!: Track[];

  @OneToMany(() => Schedule, s => s.hackathon)
  schedules!: Schedule[];

  @OneToMany(() => Contact, s => s.hackathon)
  contacts!: Contact[];
}
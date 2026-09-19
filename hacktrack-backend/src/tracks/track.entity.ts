import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Team } from '../teams/team.entity';
import { Schedule } from '../schedule/schedule.entity';
import { Hackathon } from '../hackathons/hackathon.entity';

@Entity()
export class Track {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  responsible!: string;

  @OneToMany(() => Team, team => team.track)
  teams!: Team[];

  @OneToMany(() => Schedule, schedule => schedule.track)
  schedules!: Schedule[];

  @ManyToOne(() => Hackathon, hackathon => hackathon.tracks, { nullable: false })
  hackathon!: Hackathon;
}
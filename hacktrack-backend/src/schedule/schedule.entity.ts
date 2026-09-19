import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Track } from '../tracks/track.entity';
import { Hackathon } from '../hackathons/hackathon.entity';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  startTime!: string;

  @Column()
  endTime!: string;

  @Column()
  date!: string; // "DD.MM"

  @Column()
  objective!: string;

  @Column({ default: false })
  notifiedBefore!: boolean;

  @Column({ default: false })
  notifiedStart!: boolean;

  @ManyToOne(() => Track, track => track.id, { nullable: true })
  track!: Track | null;

  @ManyToOne(() => Hackathon, hackathon => hackathon.schedules, { nullable: false })
  hackathon!: Hackathon;
}
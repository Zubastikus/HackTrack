import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Participant } from '../participants/participant.entity';
import { Track } from '../tracks/track.entity';
import { Hackathon } from '../hackathons/hackathon.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  type!: string; // web, mobile, etc

  @Column({ nullable: true })
  projectName!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  folderLink!: string;

  @Column({ nullable: true })
  designLink!: string;

  @Column({ nullable: true })
  devLink!: string;

  @Column({ nullable: true })
  managerLink!: string;

  @OneToMany(() => Participant, participant => participant.team)
  participants!: Participant[];

  @ManyToOne(() => Track, track => track.teams, { nullable: true })
  track!: Track | null;

  @ManyToOne(() => Hackathon, hackathon => hackathon.teams, { nullable: false })
  hackathon!: Hackathon;
}
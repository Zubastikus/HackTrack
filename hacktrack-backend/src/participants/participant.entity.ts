import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Team } from '../teams/team.entity';
import { Hackathon } from '../hackathons/hackathon.entity';

@Entity()
export class Participant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  lastName!: string;

  @Column()
  firstName!: string;

  @Column({ nullable: true })
  middleName!: string;

  @Column({ nullable: true })
  role!: string; // developer/designer/manager

  @Column({ nullable: true })
  school!: string;

  @Column({ nullable: true })
  grade!: string;

  @Column({ nullable: true, length: 191 })
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  @ManyToOne(() => Team, team => team.participants, { nullable: true })
  team!: Team | null;

  @ManyToOne(() => Hackathon, hackathon => hackathon.participants, { nullable: false })
  hackathon!: Hackathon;
}
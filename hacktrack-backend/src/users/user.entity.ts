import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany  } from 'typeorm';
import { Track } from '../tracks/track.entity';
import { Hackathon } from '../hackathons/hackathon.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ unique: true, length: 191 })
  email!: string;

  @ManyToMany(() => Hackathon, hackathon => hackathon.users)
  hackathons!: Hackathon[];
}
import { User } from 'src/users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'venues' })
export class Venue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cep: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  city: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contact: string;

  @Column({ nullable: true })
  coverPhoto: string;

  @Column({ nullable: true })
  profilePhoto: string;

  @Column('simple-json', { nullable: true })
  socialMedia?: { [key: string]: string }; // Ex: { instagram: 'url', facebook: 'url' }

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  userId: string;
}

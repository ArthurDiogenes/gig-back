import { Contract } from 'src/contract/contract.entity';
import { User } from 'src/users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
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

  @Column({type: 'varchar', length: 255, nullable: true})
  twitter: string;

  @Column({type: 'varchar', length: 255, nullable: true})
  instagram: string;

  @Column({type: 'varchar', length: 255, nullable: true})
  facebook: string;

  @OneToMany(() => Contract, (contract) => contract.requester)
  requestedContracts: Contract[];

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

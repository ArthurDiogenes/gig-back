import { Contract } from 'src/contract/contract.entity';
import { Music } from 'src/musics/music.entity';
import { Review } from 'src/reviews/review.entity';
import { User } from 'src/users/users.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'bands' })
export class Band {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  bandName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  city: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  genre: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contact: string;

  @Column({ type: 'int2', nullable: true })
  members: number;

  @Column({type: 'varchar', length: 255, nullable: true})
  twitter: string;

  @Column({type: 'varchar', length: 255, nullable: true})
  instagram: string;

  @Column({type: 'varchar', length: 255, nullable: true})
  facebook: string;

  @OneToMany(() => Contract, (contract) => contract.provider)
  receivedContracts: Contract[];

  @OneToMany(() => Review, (review) => review.band)
  reviews: Review[];

  @OneToMany(() => Music, (music) => music.band, {
    cascade: true,
  })
  musics: Music[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  userId: User;
}

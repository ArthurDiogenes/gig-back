import { Band } from 'src/bands/band.entity';
import { Venue } from 'src/venue/venue.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export type ContractStatus = 'pending' | 'confirmed' | 'declined' | 'canceled';

@Entity({ name: 'contracts' })
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  eventName: string;

  @Column({ type: 'date' })
  eventDate: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'varchar', length: 255 })
  eventType: string;

  @Column('decimal', { precision: 10, scale: 2 })
  budget: number;

  @Column({ type: 'text', nullable: true })
  additionalDetails?: string;

  @Column({
    type: 'varchar',
    enum: ['pending', 'confirmed', 'declined', 'canceled'],
    default: 'pending',
  })
  status: ContractStatus;

  @ManyToOne(() => Venue)
  @JoinColumn({ name: 'requester_id' })
  requester: Venue;

  @ManyToOne(() => Band)
  @JoinColumn({ name: 'provider_id' })
  provider: Band;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

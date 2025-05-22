import { Band } from 'src/bands/band.entity';
import { Venue } from 'src/venue/venue.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Venue, (venue) => venue.reviews)
  venue: Venue;

  @ManyToOne(() => Band, (band) => band.reviews)
  band: Band;

  @Column()
  rating: number;

  @Column()
  comment: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

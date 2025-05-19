import { Band } from 'src/bands/band.entity';
import { Comments } from 'src/comments/comments.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ nullable: true })
  image_file: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  likes: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  comments_count: number;

  @ManyToOne(() => Band, (band) => band.posts, { onDelete: 'CASCADE' })
  author: Band;

  @OneToMany(() => Comments, (comment) => comment.post, {
    cascade: true,
  })
  comments: Comments[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

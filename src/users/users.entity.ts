import { Comments } from 'src/comments/comments.entity';
import { Like } from 'src/likes/like.entity';
import { Post } from 'src/posts/post.entity';
import { Review } from 'src/reviews/review.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  role: 'band' | 'venue' | 'admin';

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comments, (comment) => comment.user, {
    cascade: true,
  })
  comments: Comments[];

  @OneToMany(() => Like, (like) => like.user, {
    cascade: true,
  })
  likes: Like[];

  @OneToMany(() => Review, (review) => review.band)
  reviews: Review[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

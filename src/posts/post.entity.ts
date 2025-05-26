import { Comments } from 'src/comments/comments.entity';
import { User } from 'src/users/users.entity';
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
  imageFile: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  likes: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  commentsCount: number;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Comments, (comment) => comment.post, {
    cascade: true,
  })
  comments: Comments[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

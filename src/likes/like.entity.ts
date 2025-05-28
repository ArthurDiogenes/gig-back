import { Post } from 'src/posts/post.entity';
import { User } from 'src/users/users.entity';
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'likes' })
@Unique(['user', 'post'])
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  post: Post;

  @CreateDateColumn()
  createdAt: Date;
}

import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { User } from 'src/users/users.entity';
import { Post } from 'src/posts/post.entity';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Like, User, Post]), PostsModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}

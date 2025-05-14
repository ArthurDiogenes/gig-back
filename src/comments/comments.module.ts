import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { User } from 'src/users/users.entity';
import { Post } from 'src/posts/post.entity';
import { Comments } from './comments.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Comments, Post, User])],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}

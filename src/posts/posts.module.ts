import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Band } from 'src/bands/band.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Band])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}

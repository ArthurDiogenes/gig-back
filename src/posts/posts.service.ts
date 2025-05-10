import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Band } from 'src/bands/band.entity';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createPost(postData: CreatePostDto) {
    const { content, author } = postData;

    const post = this.postRepository.create({
      content,
      author: { id: author } as Band,
    });

    return await this.postRepository.save(post);
  }
}

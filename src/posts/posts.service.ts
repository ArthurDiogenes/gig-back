import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
    
    @InjectRepository(Band)
    private readonly bandRepository: Repository<Band>,
  ) {}

  async createPost(postData: CreatePostDto) {
    const { content, author } = postData;

    const band = await this.bandRepository.findOne({
      where: { id: author },
    });
    if (!band) {
      throw new NotFoundException('Band not found');
    }

    const post = this.postRepository.create({
      content,
      author: band,
    });

    return await this.postRepository.save(post);
  }

  async getPosts() {
    return await this.postRepository.find({
      relations: ['author'],
    });
  }

  async getPostById(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async getPostsByBand(bandId: number) {
    const band = await this.bandRepository.findOne({
      where: { id: bandId },
    });
    if (!band) {
      throw new NotFoundException('Band not found');
    }
    const posts = await this.postRepository.find({
      where: { author: { id: bandId } },
      relations: ['author'],
    });
    if (posts.length === 0) {
      throw new NotFoundException('Band not has any posts');
    }
    return posts;
  }

  async getPostByBand(bandId: number, id: number){
    const band = await this.bandRepository.findOne({
      where: { id: bandId },
    });
    if (!band) {
      throw new NotFoundException('Band not found');
    }
    const post = await this.postRepository.findOne({
      where: { id, author: { id: bandId } },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;

  }

  async likePost(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.likes += 1;

    return await this.postRepository.save(post);
  }

  async unlikePost(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.likes -= 1;

    return await this.postRepository.save(post);
  }

  async deletePost(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return await this.postRepository.remove(post);
  }
}

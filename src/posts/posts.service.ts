import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
      throw new BadRequestException('Band not found');
    }

    const post = this.postRepository.create({
      content,
      author: band,
    });

    return await this.postRepository.save(post);
  }

  async getPosts(page = 1, limit = 10, orderBy = 'createdAt') {
    const skip = (page - 1) * limit;
    const take = limit;
    const order = orderBy === 'createdAt' ? 'DESC' : 'ASC';
    const [posts, total] = await this.postRepository.findAndCount({
      skip,
      take,
      order: { [orderBy]: order },
      relations: ['author'],
    });
    return {
      posts,
      total,
      page,
      limit,
    };
  }

  async getPostById(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    return post;
  }

  async getPostsByBand(bandId: number, page = 1, limit = 10, orderBy = 'createdAt') {
    const skip = (page - 1) * limit;
    const take = limit;
    const order = orderBy === 'createdAt' ? 'DESC' : 'ASC';
    const band = await this.bandRepository.findOne({
      where: { id: bandId },
    });
    if (!band) {
      throw new BadRequestException('Band not found');
    }
    const [posts, total] = await this.postRepository.findAndCount({
      where: { author: { id: bandId } },
      skip,
      take,
      order: { [orderBy]: order },
      relations: ['author'],
    });
    return {
      posts,
      total,
      page,
      limit,
    };
  }

  async getPostByBand(bandId: number, id: number){
    const band = await this.bandRepository.findOne({
      where: { id: bandId },
    });
    if (!band) {
      throw new BadRequestException('Band not found');
    }
    const post = await this.postRepository.findOne({
      where: { id, author: { id: bandId } },
      relations: ['author'],
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    return post;

  }

  async likePost(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    post.likes += 1;

    return await this.postRepository.save(post);
  }

  async unlikePost(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    post.likes -= 1;

    return await this.postRepository.save(post);
  }

  async deletePost(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    return await this.postRepository.remove(post);
  }
}

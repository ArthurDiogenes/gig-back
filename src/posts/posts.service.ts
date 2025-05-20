import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Band } from 'src/bands/band.entity';
import * as mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);
  private supabase: SupabaseClient;

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Band)
    private readonly bandRepository: Repository<Band>,
  ) {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
    );
  }

  async createPost(postData: CreatePostDto, image?: Express.Multer.File) {
    this.logger.log(`Creating new post...`);

    const { content, author } = postData;
    let image_path = null;
    if (image) {
      this.logger.log(`Image recieved, processing upload...`);
      const extension = mime.extension(image.mimetype);
      const path_name = `/posts/${uuidv4()}.${extension}`;

      const { error } = await this.supabase.storage
        .from('gig')
        .upload(path_name, image.buffer, {
          contentType: image.mimetype,
          upsert: true,
        });
      if (error) {
        this.logger.error(`Error uploading image: ${error.message}`);
        throw new InternalServerErrorException('Error uploading image');
      }
      this.logger.log(`Image uploaded successfully.`);
      image_path = path_name;
    } else {
      this.logger.log(`No image provided, skipping upload...`);
    }

    this.logger.log(`Creating post...`);
    const post = this.postRepository.save({
      content,
      authorId: author,
      likes: 0,
      imageFile: image_path,
    });

    this.logger.log(`Post created successfully.`);
    return post;
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

  async getPostsByBand(
    bandId: number,
    page = 1,
    limit = 10,
    orderBy = 'createdAt',
  ) {
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

  async getPostByBand(bandId: number, id: number) {
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

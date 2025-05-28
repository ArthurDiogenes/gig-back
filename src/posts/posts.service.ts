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
import * as mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User } from 'src/users/users.entity';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);
  private supabase: SupabaseClient;

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
    );
  }

  async createPost(postData: CreatePostDto, image?: Express.Multer.File) {
    this.logger.log(`Creating new post...`);

    const { content, authorId } = postData;

    const user = await this.userRepository.findOne({
      where: { id: authorId },
    });

    let imagePath = null;

    if (image) {
      this.logger.log(`Image received, processing upload...`);
      const extension = mime.extension(image.mimetype);
      const pathName = `/posts/${uuidv4()}.${extension}`;

      const { error } = await this.supabase.storage
        .from('gig')
        .upload(pathName, image.buffer, {
          contentType: image.mimetype,
          upsert: true,
        });

      if (error) {
        this.logger.error(`Error uploading image: ${error.message}`);
        throw new InternalServerErrorException('Error uploading image');
      }

      this.logger.log(`Image uploaded successfully.`);
      imagePath = pathName;
    } else {
      this.logger.log(`No image provided, skipping upload...`);
    }

    this.logger.log(`Creating post...`);

    const newPost = this.postRepository.create({
      content,
      user,
      likesCount: 0,
      imageFile: imagePath,
    });

    const post = await this.postRepository.save(newPost);

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
      relations: ['user'],
    });

    // Mapeia os posts para adicionar a signedUrl se houver imagem
    const postsWithSignedUrls = await Promise.all(
      posts.map(async (post) => {
        if (post.imageFile) {
          const { data, error } = await this.supabase.storage
            .from('gig')
            .createSignedUrl(post.imageFile, 60 * 60); // 1 hora
          this.logger.log('Signed URL gerada com sucesso');
          delete post.imageFile;
          if (!error && data?.signedUrl) {
            return { ...post, imageUrl: data.signedUrl };
          }
        }
        delete post.imageFile;
        return { ...post, imageUrl: null };
      }),
    );

    const totalPages = Math.ceil(total / limit);

    return {
      posts: postsWithSignedUrls,
      hasNextPage: page < totalPages,
      totalPages,
      page,
      limit,
    };
  }

  async getPostById(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['comments', 'comments.user'],
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    return post;
  }

  async getPostsByBand(
    userId: string,
    page = 1,
    limit = 10,
    orderBy = 'createdAt',
  ) {
    const skip = (page - 1) * limit;
    const take = limit;
    const order = orderBy === 'createdAt' ? 'DESC' : 'ASC';
    const band = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!band) {
      throw new BadRequestException('Band not found');
    }
    const [posts, total] = await this.postRepository.findAndCount({
      where: { user: { id: userId } },
      skip,
      take,
      order: { [orderBy]: order },
      relations: ['user'],
    });
    return {
      posts,
      total,
      page,
      limit,
    };
  }

  async getPostByBand(userId: string, id: number) {
    const band = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!band) {
      throw new BadRequestException('Band not found');
    }

    const post = await this.postRepository.findOne({
      where: { id, user: { id: userId } },
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

    post.likesCount += 1;

    return await this.postRepository.save(post);
  }

  async unlikePost(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    post.likesCount -= 1;

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

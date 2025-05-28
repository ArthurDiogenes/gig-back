import {
  Injectable,
  ConflictException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';
import { Post } from 'src/posts/post.entity';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class LikesService {
  private readonly logger = new Logger(LikesService.name);
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly postService: PostsService, // Importando o serviço de posts para possíveis interações futuras
  ) {}

  async likePost(userId: string, postId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new BadRequestException('Post not found');
    }

    const like = this.likeRepository.create({ user, post });

    try {
      await this.postService.likePost(postId);
      return await this.likeRepository.save(like);
    } catch (error) {
      if (error.code === '23505') {
        await this.postService.unlikePost(postId);
        this.logger.warn(`Post já curtido por ${userId}, descurtindo...`);
        throw new ConflictException('Post já curtido');
      }
      throw error;
    }
  }

  async unlikePost(userId: string, postId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new BadRequestException('Post not found');
    }

    const like = await this.likeRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

    if (!like) {
      throw new BadRequestException('Curtida não encontrada');
    }

    await this.postService.unlikePost(postId);

    return await this.likeRepository.remove(like);
  }

  async hasLiked(userId: string, postId: number): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new BadRequestException('Post not found');
    }
    const count = await this.likeRepository.count({
      where: { user: { id: userId }, post: { id: postId } },
    });
    return count > 0;
  }

  async getPostsLikedByUser(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const likes = await this.likeRepository.find({
      where: { user: { id: userId } },
      relations: ['post'],
    });

    return likes.map((like) => like.post);
  }
}

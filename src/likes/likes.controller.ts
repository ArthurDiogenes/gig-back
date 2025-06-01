import {
  Controller,
  Post,
  Delete,
  Param,
  Get,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { TokenPayload } from 'src/auth/auth';

@Controller('likes')
export class LikesController {
  private readonly logger = new Logger(LikesController.name);
  constructor(private readonly likeService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:postId')
  async likePost(@User() user: TokenPayload, @Param('postId') postId: number) {
    this.logger.log(`User ${user}`);
    const userId = user.sub.id;
    this.logger.log(`User ${userId} is liking post with ID ${postId}`);
    await this.likeService.likePost(userId, postId);
    return { message: 'Post curtido com sucesso!' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:postId')
  async unlikePost(
    @User() user: TokenPayload,
    @Param('postId') postId: number,
  ) {
    const userId = user.sub.id;
    await this.likeService.unlikePost(userId, postId);
    return { message: 'Post descurtido com sucesso!' };
  }

  @Get('user/:userId')
  async getPostsLikedByUser(@Param('userId') userId: string) {
    const posts = await this.likeService.getPostsLikedByUser(userId);
    return { posts };
  }

  @Get(':userId/:postId')
  async hasLiked(
    @Param('userId') userId: string,
    @Param('postId') postId: number,
  ) {
    const liked = await this.likeService.hasLiked(userId, postId);
    return { liked };
  }
}

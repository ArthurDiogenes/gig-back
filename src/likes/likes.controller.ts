import { Controller, Post, Delete, Param, Get } from '@nestjs/common';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likeService: LikesService) {}

  @Post(':userId/:postId')
  async likePost(
    @Param('userId') userId: string,
    @Param('postId') postId: number,
  ) {
    await this.likeService.likePost(userId, postId);
    return { message: 'Post curtido com sucesso!' };
  }

  @Delete(':userId/:postId')
  async unlikePost(
    @Param('userId') userId: string,
    @Param('postId') postId: number,
  ) {
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

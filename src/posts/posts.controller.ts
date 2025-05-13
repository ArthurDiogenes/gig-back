import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async createPost(@Body() postData: CreatePostDto) {
    return await this.postsService.createPost(postData);
  }

  @Get()
  async getPosts() {
    return await this.postsService.getPosts();
  }

  @Get(':id')
  async getPostById(@Param('id') id: number) {
    return await this.postsService.getPostById(+id);
  }

  @Get('band/:authorId')
  async getPostByAuthor(@Param('authorId') authorId: number) {
    return await this.postsService.getPostByAuthor(+authorId);
  }

  @Patch('like/:id')
  async likePost(@Param('id') id: number) {
    return await this.postsService.likePost(+id);
  }

  @Patch('unlike/:id')
  async unlikePost(@Param('id') id: number) {
    return await this.postsService.unlikePost(+id);
  }

  @HttpCode(204)
  @Delete(':id')
  async deletePost(@Param('id') id: number) {
    return await this.postsService.deletePost(+id);
  }
}

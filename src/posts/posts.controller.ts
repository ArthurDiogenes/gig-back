import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
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
  async getPosts(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('orderBy') orderBy: string = 'createdAt',
  ) {
    return await this.postsService.getPosts(+page, +limit, orderBy);
  }

  @Get(':id')
  async getPostById(@Param('id') id: number) {
    return await this.postsService.getPostById(+id);
  }

  @Get('band/:bandId')
  async getPostsByBand(
    @Param('bandId') bandId: number,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('orderBy') orderBy: string = 'createdAt',
  ) {
    return await this.postsService.getPostsByBand(+bandId, +page, +limit, orderBy);
  }

  @Get('band/:bandId/:id')
  async getPostByBand(@Param('bandId') bandId: number, @Param('id') id: number) {
    return await this.postsService.getPostByBand(+bandId, +id);
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

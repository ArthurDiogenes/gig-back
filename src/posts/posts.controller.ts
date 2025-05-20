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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
      },
      fileFilter: (
        _: any,
        file: { mimetype: string },
        cb: (arg0: Error, arg1: boolean) => void,
      ) => {
        const allowedMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type'), false);
        }
      },
    }),
  )
  async createPost(
    @Body() postData: CreatePostDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return await this.postsService.createPost(postData, image);
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
  async getPostByBand(
    @Param('bandId') bandId: number,
    @Param('id') id: number,
  ) {
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

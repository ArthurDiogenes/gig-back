import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async createComment(@Body() body: CreateCommentDto) {
    return this.commentsService.createComment(body);
  }

  @Get(':id')
  async getCommentById(@Param('id') id: number) {
    return this.commentsService.getCommentById(+id);
  }

  @Get('post/:id')
  async getCommentsByPostId(@Param('id') id: number) {
    return this.commentsService.getCommentsByPostId(+id);
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteComment(@Param('id') id: number) {
    return this.commentsService.deleteComment(+id);
  }
}

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Post } from 'src/posts/post.entity';
import { User } from 'src/users/users.entity';
import { Comments } from './comments.entity';

@Injectable()
export class CommentsService {
    private readonly logger = new Logger(CommentsService.name);
    constructor(
        @InjectRepository(Comments)
        private readonly commentRepository: Repository<Comments>,

        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async createComment(body: CreateCommentDto) {
        const { postId, userId } = body;

        const post = await this.postRepository.findOne({
            where: { id: postId },
        });
        if (!post) {
            this.logger.error(`Post not found: ${postId}`);
            throw new BadRequestException('Post not found');
        }

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            this.logger.error(`User not found: ${userId}`);
            throw new BadRequestException('User not found');
        }
        delete user.password;

        const comment = this.commentRepository.create({
            post,
            user,
            comment: body.comment,
        });

        return await this.commentRepository.save(comment);
    }

    async getCommentById(id: number) {
        const comment = await this.commentRepository.findOne({
            where: { id },
            relations: ['user', 'post'],
        });
        delete comment.user.password;

        if (!comment) {
            this.logger.error(`Comment not found: ${id}`);
            throw new BadRequestException('Comment not found');
        }

        return comment;
    }

    async getCommentsByPostId(id: number) {
        const post = await this.postRepository.findOne({
            where: { id },
        });
        if (!post) {
            this.logger.error(`Post not found: ${id}`);
            throw new BadRequestException('Post not found');
        }
        const comments = await this.commentRepository.find({
            where: { post: { id } },
            relations: ['user', 'post'],
            select: {
                user: {
                    password: false,
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
        }});

        if (!comments) {
            this.logger.error(`Comments not found for post: ${id}`);
            throw new BadRequestException('Comments not found');
        }
        return comments;
    }

    async deleteComment(id: number) {
        const comment = await this.commentRepository.findOne({
            where: { id },
        });
        if (!comment) {
            this.logger.error(`Comment not found: ${id}`);
            throw new BadRequestException('Comment not found');
        }

        return await this.commentRepository.delete({ id });
    }

}

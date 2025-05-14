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

}

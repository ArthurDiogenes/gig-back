import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'Comment must be a string.' })
  @IsNotEmpty({ message: 'Comment is required.' })
  comment: string;

  @IsNotEmpty({ message: 'Post ID is required.' })
  postId: number;

  @IsNotEmpty({ message: 'User ID is required.' })
  userId: string;
}

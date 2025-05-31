import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Review } from './review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-reviews.dto';
import { Band } from 'src/bands/band.entity';
import { User } from 'src/users/users.entity';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,

    @InjectRepository(Band)
    private readonly bandRepository: Repository<Band>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createReview(body: CreateReviewDto) {
    const { bandId, userId, rating, comment } = body;
    const band = await this.bandRepository.findOneBy({ id: bandId });
    if (!band) {
      this.logger.error(`Band with ID ${bandId} not found`);
      throw new BadRequestException('Band not found');
    }
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      throw new BadRequestException('User not found');
    }
    if (rating < 1 || rating > 5) {
      this.logger.error(`Invalid rating: ${rating}. Must be between 1 and 5.`);
      throw new BadRequestException('Rating must be between 1 and 5');
    }
    const review = this.reviewsRepository.create({
      band,
      user,
      rating,
      comment,
    });
    try {
      return await this.reviewsRepository.save(review);
    } catch (error) {
      this.logger.error('Error creating review', error.stack);
      throw new InternalServerErrorException('Error creating review');
    }
  }
}

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
import { Venue } from 'src/venue/venue.entity';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,

    @InjectRepository(Band)
    private readonly bandRepository: Repository<Band>,

    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
  ) {}

  async createReview(body: CreateReviewDto) {
    const { bandId, venueId, rating, comment } = body;
    const band = await this.bandRepository.findOneBy({ id: bandId });
    if (!band) {
      this.logger.error(`Band with ID ${bandId} not found`);
      throw new BadRequestException('Band not found');
    }
    const venue = await this.venueRepository.findOneBy({ id: venueId });
    if (!venue) {
      this.logger.error(`Venue with ID ${venueId} not found`);
      throw new BadRequestException('Venue not found');
    }
    if (rating < 1 || rating > 5) {
      this.logger.error(`Invalid rating: ${rating}. Must be between 1 and 5.`);
      throw new BadRequestException('Rating must be between 1 and 5');
    }
    const review = this.reviewsRepository.create({
      band,
      venue,
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

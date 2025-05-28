import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Band } from 'src/bands/band.entity';
import { Venue } from 'src/venue/venue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Band, Venue])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}

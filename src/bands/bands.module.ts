import { Module } from '@nestjs/common';
import { BandsService } from './bands.service';
import { BandsController } from './bands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Band } from './band.entity';
import { Review } from 'src/reviews/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Band, Review])],
  controllers: [BandsController],
  providers: [BandsService],
  exports: [TypeOrmModule, BandsService],
})
export class BandsModule {}

import { Module } from '@nestjs/common';
import { VenueService } from './venue.service';
import { VenueController } from './venue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venue } from './venue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venue])],
  controllers: [VenueController],
  providers: [VenueService],
  exports: [TypeOrmModule, VenueService],
})
export class VenueModule {}

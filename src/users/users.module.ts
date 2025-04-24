import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { VenueModule } from 'src/venue/venue.module';
import { BandsModule } from 'src/bands/bands.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), VenueModule, BandsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule],
})
export class UsersModule {}

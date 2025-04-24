import { Module } from '@nestjs/common';
import { BandsService } from './bands.service';
import { BandsController } from './bands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Band } from './band.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Band])],
  controllers: [BandsController],
  providers: [BandsService],
  exports: [TypeOrmModule, BandsService],
})
export class BandsModule {}

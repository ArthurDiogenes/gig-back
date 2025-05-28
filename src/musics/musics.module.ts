import { Module } from '@nestjs/common';
import { MusicsController } from './musics.controller';
import { MusicsService } from './musics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Music } from './music.entity';
import { Band } from 'src/bands/band.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Music, Band])],
  controllers: [MusicsController],
  providers: [MusicsService]
})
export class MusicsModule {}

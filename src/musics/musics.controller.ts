import { Body, Controller, Post } from '@nestjs/common';
import { MusicsService } from './musics.service';
import { CreateMusicDto } from './dto/create-music.dto';

@Controller('musics')
export class MusicsController {
    constructor(private readonly musicsService: MusicsService) {}

    @Post()
    async createMusic(@Body() musicData: CreateMusicDto) {
        return await this.musicsService.createMusic(musicData);
    }
}

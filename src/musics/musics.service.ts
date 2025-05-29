import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Music } from './music.entity';
import { Band } from 'src/bands/band.entity';
import { CreateMusicDto } from './dto/create-music.dto';

@Injectable()
export class MusicsService {
    private readonly logger = new Logger(MusicsService.name);

    constructor(
        @InjectRepository(Music)
        private readonly musicRepository: Repository<Music>,

        @InjectRepository(Band)
        private readonly bandRepository: Repository<Band>,
    ) { }

    async createMusic(musicData: CreateMusicDto) {
        const { name, bandId } = musicData;
        const band = await this.bandRepository.findOne({
            where: { id: bandId },
        })
        if (!band) {
            this.logger.error(`Band with ID ${bandId} not found`);
            throw new BadRequestException(`Band with ID ${bandId} not found`);
        }
        const music = this.musicRepository.create({
            name,
            band,
        });
        try {
            const savedMusic = await this.musicRepository.save(music);
            this.logger.log(`Music ${savedMusic.name} created successfully`);
            return savedMusic;
        }
        catch (error) {
            this.logger.error(`Error creating music: ${error.message}`);
            throw new BadRequestException('Error creating music');
        }
    }
}

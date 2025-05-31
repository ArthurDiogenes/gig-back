import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Venue } from './venue.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

@Injectable()
export class VenueService {
  private readonly logger = new Logger(VenueService.name);
  constructor(
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
  ) {}

  async create(createVenueDto: CreateVenueDto) {
    this.logger.log(createVenueDto);
    try {
      await this.venueRepository.save(createVenueDto);
      return {
        message: 'Estabelecimento cadastrado com sucesso',
      };
    } catch (error) {
      this.logger.error('Erro ao cadastrar o estabelecimento', error.stack);
      throw new InternalServerErrorException(
        'Erro ao cadastrar o estabelecimento',
      );
    }
  }

  async findAll() {
    return await this.venueRepository.find();
  }

  async findOne(id: string) {
    return `This action returns a #${id} venue`;
  }

  async findVenueByUser(id: string) {
    this.logger.log(id);
    const venue = await this.venueRepository.findOne({
      where: { user: { id } },
      relations: ['user'],
      select: {
        user: {
          id: true,
          role: true,
        },
      },
    });
    if (!venue) {
      throw new BadRequestException('Estabelecimento não encontrado');
    }
    return venue;
  }

  async update(
    id: string,
    updateVenueDto: UpdateVenueDto,
    files: {
      coverPhoto?: Express.Multer.File;
      profilePhoto?: Express.Multer.File;
    },
  ) {
    const venue = await this.venueRepository.findOne({
      where: { id },
    });

    if (!venue) {
      throw new Error('Venue not found');
    }

    if (files.coverPhoto) {
      venue.coverPhoto = this.saveFile(files.coverPhoto);
    }

    if (files.profilePhoto) {
      venue.profilePhoto = this.saveFile(files.profilePhoto);
    }

    // Atualiza as outras propriedades
    Object.assign(venue, updateVenueDto);

    return this.venueRepository.save(venue);
  }

  async remove(id: string) {
    return `This action removes a #${id} venue`;
  }

  private saveFile(file: Express.Multer.File): string {
    const fileExtension = path.extname(file.originalname);
    const fileName = uuid.v4() + fileExtension;
    const filePath = path.join(__dirname, '../../uploads', fileName);

    // Verifica se a pasta 'uploads' existe, se não, cria
    if (!fs.existsSync(path.join(__dirname, '../../uploads'))) {
      fs.mkdirSync(path.join(__dirname, '../../uploads'));
    }

    // Salva o arquivo
    fs.writeFileSync(filePath, file.buffer);

    return fileName;
  }
}

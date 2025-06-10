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
    const venue = await this.venueRepository.findOne({
      where: { id },
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

  async findVenueByUser(id: string) {
    this.logger.log(`Finding venue by user ID: ${id}`);
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
    files?: {
      coverPhoto?: Express.Multer.File;
      profilePhoto?: Express.Multer.File;
    },
  ) {
    const venue = await this.venueRepository.findOne({
      where: { id },
    });

    if (!venue) {
      throw new BadRequestException('Estabelecimento não encontrado');
    }

    // Handle file uploads if provided
    if (files?.coverPhoto) {
      venue.coverPhoto = this.saveFile(files.coverPhoto);
    }

    if (files?.profilePhoto) {
      venue.profilePhoto = this.saveFile(files.profilePhoto);
    }

    // Update other properties
    Object.assign(venue, updateVenueDto);

    try {
      await this.venueRepository.save(venue);
      return {
        message: 'Estabelecimento atualizado com sucesso',
        data: venue,
      };
    } catch (error) {
      this.logger.error('Erro ao atualizar estabelecimento', error.stack);
      throw new InternalServerErrorException(
        'Erro ao atualizar estabelecimento',
      );
    }
  }

  async remove(id: string) {
    const venue = await this.venueRepository.findOne({
      where: { id },
    });

    if (!venue) {
      throw new BadRequestException('Estabelecimento não encontrado');
    }

    try {
      await this.venueRepository.remove(venue);
      return {
        message: 'Estabelecimento removido com sucesso',
      };
    } catch (error) {
      this.logger.error('Erro ao remover estabelecimento', error.stack);
      throw new InternalServerErrorException(
        'Erro ao remover estabelecimento',
      );
    }
  }

  private saveFile(file: Express.Multer.File): string {
    const fileExtension = path.extname(file.originalname);
    const fileName = uuid.v4() + fileExtension;
    const filePath = path.join(__dirname, '../../uploads', fileName);

    // Check if uploads directory exists, create if not
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save the file
    fs.writeFileSync(filePath, file.buffer);

    return fileName;
  }
}
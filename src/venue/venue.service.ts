import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Venue } from './venue.entity';
import { Repository } from 'typeorm';
import * as uuid from 'uuid';
import * as mime from 'mime-types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class VenueService {
  private readonly logger = new Logger(VenueService.name);
  private supabase: SupabaseClient;

  constructor(
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
  ) {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
    );
  }

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

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [results, total] = await this.venueRepository.findAndCount({
      relations: ['user'],
      select: {
        id: true,
        name: true,
        type: true,
        city: true,
        description: true,
        address: true,
        contact: true,
        cep: true,
        coverPhoto: true,
        profilePhoto: true,
        user: {
          id: true,
          role: true,
        },
      },
      take: limit,
      skip,
      order: { name: 'ASC' },
    });

    return {
      data: results,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
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

  async findVenueByUser(id: string): Promise<Venue> {
    const venue = await this.venueRepository.findOne({
      where: { user: { id: id } },
      relations: ['user'],
    });

    if (!venue) {
      throw new BadRequestException('Venue não encontrada');
    }

    const expiresIn = 60 * 60;

    if (venue.profilePhoto) {
      const { data, error } = await this.supabase.storage
        .from('gig')
        .createSignedUrl(venue.profilePhoto, expiresIn);
      if (error) {
        throw new InternalServerErrorException(
          'Erro ao gerar URL para a foto de perfil.',
        );
      }
      venue.profilePhoto = data.signedUrl;
    }

    if (venue.coverPhoto) {
      const { data, error } = await this.supabase.storage
        .from('gig')
        .createSignedUrl(venue.coverPhoto, expiresIn);

      if (error) {
        throw new InternalServerErrorException(
          'Erro ao gerar URL para a foto de capa.',
        );
      }
      venue.coverPhoto = data.signedUrl;
    }

    return venue;
  }

  async updateByUserId(
    userId: string,
    updateVenueDto: UpdateVenueDto,
    files: {
      profilePhoto?: Express.Multer.File;
      coverPhoto?: Express.Multer.File;
    },
  ): Promise<Venue> {
    this.logger.log(
      `Iniciando atualização do venue para o usuário com ID: ${userId}`,
    );

    const venue = await this.venueRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!venue) {
      this.logger.warn(`Venue para o usuário com ID ${userId} não encontrado.`);
      throw new NotFoundException(
        `Venue para o usuário com ID ${userId} não encontrado.`,
      );
    }

    const dataToUpdate: Partial<Venue> = { ...updateVenueDto };
    this.logger.log(`Dados para atualização: ${JSON.stringify(dataToUpdate)}`);

    if (files.profilePhoto) {
      this.logger.log(
        `Iniciando upload da imagem de perfil para o usuário com ID: ${userId}`,
      );
      const url = await this.uploadToSupabase(
        files.profilePhoto,
        'venue_profile',
      );
      dataToUpdate.profilePhoto = url;
      this.logger.log(`Imagem de perfil atualizada com URL: ${url}`);
    }

    if (files.coverPhoto) {
      this.logger.log(
        `Iniciando upload da imagem de capa para o usuário com ID: ${userId}`,
      );
      const url = await this.uploadToSupabase(files.coverPhoto, 'venue_cover');
      dataToUpdate.coverPhoto = url;
      this.logger.log(`Imagem de capa atualizada com URL: ${url}`);
    }

    if (Object.keys(dataToUpdate).length > 0) {
      this.logger.log(`Atualizando venue com ID: ${venue.id}`);
      await this.venueRepository.update({ id: venue.id }, dataToUpdate);
    }

    const updatedVenue = await this.venueRepository.findOneBy({ id: venue.id });
    this.logger.log(
      `Venue atualizado com sucesso: ${JSON.stringify(updatedVenue)}`,
    );
    return updatedVenue;
  }

  /**
   * Faz upload de um arquivo para o Supabase Storage.
   * @param file O arquivo para upload (de Express.Multer).
   * @param folder O caminho da pasta dentro do bucket 'gig'.
   * @returns A URL pública do arquivo.
   */
  private async uploadToSupabase(
    image: Express.Multer.File,
    folder: 'venue_profile' | 'venue_cover',
  ): Promise<string> {
    this.logger.log(`Iniciando upload do arquivo para a pasta: ${folder}`);
    this.logger.log(`Image received, processing upload...`);
    let imagePath: string = '';
    const extension = mime.extension(image.mimetype);
    const pathName = `/${folder}/${uuid.v4()}.${extension}`;

    const { error } = await this.supabase.storage
      .from('gig')
      .upload(pathName, image.buffer, {
        contentType: image.mimetype,
        upsert: true,
      });

    if (error) {
      this.logger.error(`Error uploading image: ${error.message}`);
      throw new InternalServerErrorException('Error uploading image');
    }

    this.logger.log(`Image uploaded successfully.`);
    imagePath = pathName;

    return imagePath;
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
      throw new InternalServerErrorException('Erro ao remover estabelecimento');
    }
  }
}

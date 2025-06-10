import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Band } from './band.entity';
import { ILike, Repository } from 'typeorm';
import { User } from 'src/users/users.entity';
import { Review } from 'src/reviews/review.entity';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import * as mime from 'mime-types';

@Injectable()
export class BandsService {
  private readonly logger = new Logger(BandsService.name);
  private supabase: SupabaseClient;
  constructor(
    @InjectRepository(Band)
    private readonly bandRepository: Repository<Band>,

    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
    );
  }

  async create(CreateBandDto: CreateBandDto) {
    this.logger.log(CreateBandDto);
    try {
      const band = this.bandRepository.create({
        ...CreateBandDto,
        userId: { id: CreateBandDto.userId } as User,
      });
      await this.bandRepository.save(band);
      return {
        message: 'Banda cadastrada com sucesso',
      };
    } catch (error) {
      this.logger.error('Erro ao cadastrar banda', error.stack);
      throw new InternalServerErrorException('Erro ao cadastrar banda');
    }
  }

  async findAll() {
    return await this.bandRepository.find();
  }

  async findOne(id: number) {
    const band = await this.bandRepository.findOne({
      where: { id },
      relations: ['userId'],
      select: {
        userId: {
          id: true,
          role: true,
        },
      },
    });
    if (!band) {
      throw new BadRequestException('Banda não encontrada');
    }
    return band;
  }

  async findBandByUser(id: string): Promise<Band> {
    const band = await this.bandRepository.findOne({
      where: { userId: { id: id } },
      relations: ['userId'],
    });

    if (!band) {
      throw new BadRequestException('Banda não encontrada');
    }

    const expiresIn = 60 * 60;

    if (band.profilePicture) {
      const { data, error } = await this.supabase.storage
        .from('gig')
        .createSignedUrl(band.profilePicture, expiresIn);
      if (error) {
        throw new InternalServerErrorException(
          'Erro ao gerar URL para a foto de perfil.',
        );
      }
      band.profilePicture = data.signedUrl;
    }

    if (band.coverPicture) {
      const { data, error } = await this.supabase.storage
        .from('gig')
        .createSignedUrl(band.coverPicture, expiresIn);

      if (error) {
        throw new InternalServerErrorException(
          'Erro ao gerar URL para a foto de capa.',
        );
      }
      band.coverPicture = data.signedUrl;
    }

    return band;
  }
  async getFeaturedBands(limit: number) {
    const results = await this.reviewRepository
      .createQueryBuilder('review')
      .innerJoin('review.band', 'band')
      .innerJoin('band.userId', 'user')
      .select('band.id', 'bandId')
      .addSelect('band.band_name', 'bandName')
      .addSelect('user.id', 'userId')
      .addSelect('AVG(review.rating)', 'averageRating')
      .groupBy('band.id')
      .addGroupBy('band.band_name')
      .addGroupBy('user.id')
      .orderBy('AVG(review.rating)', 'DESC')
      .limit(limit)
      .getRawMany();

    return results;
  }

  async search(name: string, page = 1, limit = 10) {
    if (!name) return [];

    const skip = (page - 1) * limit;

    const [results, total] = await this.bandRepository.findAndCount({
      where: [
        { bandName: ILike(`%${name}%`) },
        { city: ILike(`%${name}%`) },
        { genre: ILike(`%${name}%`) },
      ],
      relations: ['userId'], // Include the userId relation
      select: {
        id: true,
        bandName: true,
        city: true,
        genre: true,
        description: true,
        contact: true,
        members: true,
        createdAt: true,
        updatedAt: true,
        userId: {
          id: true,
          role: true,
        },
      },
      take: limit,
      skip,
      order: { bandName: 'ASC' },
    });

    return {
      data: results,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getReviewsByBandId(id: string) {
    const band = await this.bandRepository.findOne({
      where: { userId: { id: id } },
      relations: ['reviews'],
    });
    if (!band) {
      throw new BadRequestException('Banda não encontrada');
    }
    const reviews = await this.reviewRepository.find({
      where: { band: { id: band.id } },
      relations: ['user'],
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: {
          id: true,
          name: true,
        },
      },
      order: { createdAt: 'DESC' },
    });

    return reviews;
  }

  async updateByUserId(
    userId: string,
    updateBandDto: UpdateBandDto,
    files: {
      profilePicture?: Express.Multer.File;
      coverPicture?: Express.Multer.File;
    },
  ): Promise<Band> {
    this.logger.log(
      `Iniciando atualização da banda para o usuário com ID: ${userId}`,
    );

    const band = await this.bandRepository.findOne({
      where: { userId: { id: userId } },
      relations: ['userId'],
    });

    if (!band) {
      this.logger.warn(`Banda para o usuário com ID ${userId} não encontrada.`);
      throw new NotFoundException(
        `Banda para o usuário com ID ${userId} não encontrada.`,
      );
    }

    const dataToUpdate: Partial<Band> = { ...updateBandDto };
    this.logger.log(`Dados para atualização: ${JSON.stringify(dataToUpdate)}`);
    console.log(files.coverPicture, files.profilePicture);

    if (files.profilePicture) {
      this.logger.log(
        `Iniciando upload da imagem de perfil para o usuário com ID: ${userId}`,
      );
      const url = await this.uploadToSupabase(
        files.profilePicture,
        'band_profile',
      );
      dataToUpdate.profilePicture = url;
      this.logger.log(`Imagem de perfil atualizada com URL: ${url}`);
    }

    if (files.coverPicture) {
      this.logger.log(
        `Iniciando upload da imagem de capa para o usuário com ID: ${userId}`,
      );
      const url = await this.uploadToSupabase(files.coverPicture, 'band_cover');
      dataToUpdate.coverPicture = url;
      this.logger.log(`Imagem de capa atualizada com URL: ${url}`);
    }

    if (Object.keys(dataToUpdate).length > 0) {
      this.logger.log(`Atualizando banda com ID: ${band.id}`);
      await this.bandRepository.update({ id: band.id }, dataToUpdate);
    }

    const updatedBand = await this.bandRepository.findOneBy({ id: band.id });
    this.logger.log(
      `Banda atualizada com sucesso: ${JSON.stringify(updatedBand)}`,
    );
    return updatedBand;
  }

  /**
   * Faz upload de um arquivo para o Supabase Storage.
   * @param file O arquivo para upload (de Express.Multer).
   * @param folder O caminho da pasta dentro do bucket 'gig'.
   * @returns A URL pública do arquivo.
   */
  private async uploadToSupabase(
    image: Express.Multer.File,
    folder: 'band_profile' | 'band_cover',
  ): Promise<string> {
    this.logger.log(`Iniciando upload do arquivo para a pasta: ${folder}`);
    this.logger.log(`Image received, processing upload...`);
    let imagePath: string = '';
    const extension = mime.extension(image.mimetype);
    const pathName = `/${folder}/${uuidv4()}.${extension}`;

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

  async updateBand(id: number, updateBandDto: UpdateBandDto) {
    const band = await this.bandRepository.findOne({
      where: { id },
    });

    if (!band) {
      throw new BadRequestException('Banda não encontrada');
    }

    console.log('updateBandDto', updateBandDto);

    await this.bandRepository.update(id, updateBandDto);
    return { message: 'Banda atualizada com sucesso' };
  }

  async remove(id: number) {
    return `This action removes a #${id} band`;
  }
}

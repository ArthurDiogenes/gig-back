import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Band } from './band.entity';
import { ILike, Repository } from 'typeorm';
import { User } from 'src/users/users.entity';
import { Review } from 'src/reviews/review.entity';

@Injectable()
export class BandsService {
  private readonly logger = new Logger(BandsService.name);
  constructor(
    @InjectRepository(Band)
    private readonly bandRepository: Repository<Band>,

    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

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

  async findBandByUser(id: string) {
    const band = await this.bandRepository.findOne({
      where: { userId: { id: id } },
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

  async getFeaturedBands(limit: number) {
    return this.reviewRepository
      .createQueryBuilder('review')
      .innerJoin('review.band', 'band')
      .select('band.id', 'bandId')
      .addSelect('band.band_name', 'bandName')
      .addSelect('band.user_id', 'userId')
      .addSelect('AVG(review.rating)', 'averageRating')
      .groupBy('band.id')
      .addGroupBy('band.band_name')
      .addGroupBy('band.user_id')
      .orderBy('AVG(review.rating)', 'DESC')
      .limit(limit)
      .getRawMany();
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

  async update(id: number, updateBandDto: UpdateBandDto) {
    return `This action updates a #${id} band ${updateBandDto}`;
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

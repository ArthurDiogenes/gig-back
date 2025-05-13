import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Band } from './band.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';

@Injectable()
export class BandsService {
  private readonly logger = new Logger(BandsService.name);
  constructor(
    @InjectRepository(Band)
    private readonly bandRepository: Repository<Band>,
  ) {}

  async create(CreateBandDto: CreateBandDto) {
    this.logger.log(CreateBandDto);
    try {
      const band = this.bandRepository.create({
        ...CreateBandDto,
        userId: { id: CreateBandDto.userId } as User,
      });
      return await this.bandRepository.save(band);
    } catch (error) {
      this.logger.error('Erro ao cadastrar banda', error.stack);
      throw new InternalServerErrorException('Erro ao cadastrar banda');
    }
  }

  async findAll() {
    return `This action returns all bands`;
  }

  async findOne(id: number) {
    const band = await this.bandRepository.findOne({
      where: { id },
    });
    if (!band) {
      throw new NotFoundException('Banda não encontrada');
    }
    return band;
  }

  async update(id: number, updateBandDto: UpdateBandDto) {
    return `This action updates a #${id} band ${updateBandDto}`;
  }

  async remove(id: number) {
    return `This action removes a #${id} band`;
  }
}

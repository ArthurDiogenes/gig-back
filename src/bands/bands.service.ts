import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';
import { Response } from 'express';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Band } from './band.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BandsService {
  private readonly logger = new Logger(BandsService.name);
  constructor(
    @InjectRepository(Band)
    private readonly bandRepository: Repository<Band>,
  ) {}

  async create(CreateBandDto: CreateBandDto, res: Response) {
    this.logger.log(CreateBandDto);
    try {
      const band = await this.bandRepository.save(CreateBandDto);
      this.logger.log(`Band created with id: ${band.id}`);
      return res.status(201).send({
        message: 'Banda cadastrada com sucesso',
      });
    } catch (error) {
      this.logger.error('Erro ao cadastrar banda', error.stack);
      throw new InternalServerErrorException('Erro ao cadastrar banda');
    }
  }

  async findAll() {
    return `This action returns all bands`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} band`;
  }

  async update(id: number, updateBandDto: UpdateBandDto) {
    return `This action updates a #${id} band ${updateBandDto}`;
  }

  async remove(id: number) {
    return `This action removes a #${id} band`;
  }
}

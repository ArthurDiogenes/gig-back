import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Venue } from './venue.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VenueService {
  private readonly logger = new Logger(VenueService.name);
  constructor(
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
  ) {}

  async create(createVenueDto: CreateVenueDto) {
    console.log(createVenueDto);
    return 'This action adds a new venue';
  }

  async findAll() {
    return `This action returns all venue`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} venue`;
  }

  async update(id: number, updateVenueDto: UpdateVenueDto) {
    const venueToUpdate = this.venueRepository.findOne({ where: { id } });
    if (!venueToUpdate) {
      this.logger.log(`Venue not found with id: ${id}`);
      throw new NotFoundException('Venue not found');
    }
    this.logger.log(`Updating venue with id: ${id}`);
    return await this.venueRepository.update(id, updateVenueDto);
  }

  async remove(id: number) {
    return `This action removes a #${id} venue`;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';

@Injectable()
export class VenueService {
  create(createVenueDto: CreateVenueDto) {
    return 'This action adds a new venue';
  }

  findAll() {
    return `This action returns all venue`;
  }

  findOne(id: number) {
    return `This action returns a #${id} venue`;
  }

  update(id: number, updateVenueDto: UpdateVenueDto) {
    return `This action updates a #${id} venue`;
  }

  remove(id: number) {
    return `This action removes a #${id} venue`;
  }
}

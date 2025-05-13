import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { Venue } from 'src/venue/venue.entity';
import { Band } from 'src/bands/band.entity';

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);

  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,

    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,

    @InjectRepository(Band)
    private readonly bandRepository: Repository<Band>,
  ) {}

  async createContract(createContractDto: CreateContractDto) {
    const { requesterId, providerId, ...rest } = createContractDto;

    const requester = await this.venueRepository.findOneBy({ id: requesterId });
    if (!requester) {
      throw new NotFoundException(
        `Venue (requester) with ID ${requesterId} not found`,
      );
    }

    const provider = await this.bandRepository.findOneBy({ id: providerId });
    if (!provider) {
      throw new NotFoundException(
        `Band (provider) with ID ${providerId} not found`,
      );
    }

    const contract = this.contractRepository.create({
      ...rest,
      requester,
      provider,
    });

    await this.contractRepository.save(contract);

    this.logger.log(`Contract created: ${contract.id}`);
    return contract;
  }
}

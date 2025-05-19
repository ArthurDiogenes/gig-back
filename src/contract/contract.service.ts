import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
      throw new BadRequestException(
        `Venue (requester) with ID ${requesterId} not found`,
      );
    }

    const provider = await this.bandRepository.findOneBy({ id: providerId });
    if (!provider) {
      throw new BadRequestException(
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

  async getContracts() {
    return await this.contractRepository.find({
      relations: ['requester', 'provider'],
    });
  }

  async getContractById(id: string) {
    const contract = await this.contractRepository.findOne({
      where: { id },
      relations: ['requester', 'provider'],
    });
    if (!contract) {
      throw new BadRequestException(`Contract with ID ${id} not found`);
    }
    return contract;
  }

  async getContractsByBand(bandId: number) {
    const band = await this.bandRepository.findOne({
      where: { id: bandId }
    });

    if (!band) {
      throw new BadRequestException(`Band with ID ${bandId} not found`);
    }

    const contracts = await this.contractRepository.find({
      where: { provider: { id: bandId } },
      relations: ['requester'],
    });

    return contracts;
  }

  async getContractsByVenue(venueId: string) {
    const venue = await this.venueRepository.findOne({
      where: { id: venueId }
    });

    if (!venue) {
      throw new BadRequestException(`Venue with ID ${venueId} not found`);
    }

    const contracts = await this.contractRepository.find({
      where: { requester: { id: venueId } },
      relations: ['provider'],
    });

    return contracts;
  }

  async confirmContract(id: string) {
    const contract = await this.contractRepository.findOne({
      where: { id },
      relations: ['requester', 'provider'],
    });

    if (!contract) {
      throw new BadRequestException(`Contract with ID ${id} not found`);
    }

    contract.isConfirmed = true;
    await this.contractRepository.save(contract);

    this.logger.log(`Contract confirmed: ${contract.id}`);
    return contract;
  }

  async cancelContract(id: string) {
    const contract = await this.contractRepository.findOne({
      where: { id },
      relations: ['requester', 'provider'],
    });

    if (!contract) {
      throw new BadRequestException(`Contract with ID ${id} not found`);
    }

    contract.isConfirmed = false;
    await this.contractRepository.save(contract);

    this.logger.log(`Contract cancelled: ${contract.id}`);
    return contract;
  }

  async deleteContract(id: string) {
    const contract = await this.contractRepository.findOne({
      where:{id},
    })
    if (!contract) {
      throw new BadRequestException(`Contract with ID ${id} not found`);
    }
    await this.contractRepository.delete(id);
}
}
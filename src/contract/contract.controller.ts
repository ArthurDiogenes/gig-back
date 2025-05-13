import { Body, Controller, Post } from '@nestjs/common';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';

@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  async createContract(@Body() createContractDto: CreateContractDto) {
    return await this.contractService.createContract(createContractDto);
  }
}

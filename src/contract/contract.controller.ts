import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';

@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  async createContract(@Body() createContractDto: CreateContractDto) {
    return await this.contractService.createContract(createContractDto);
  }

  @Get()
  async getContracts() {
    return await this.contractService.getContracts();
  }

  @Get(':id')
  async getContractById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.contractService.getContractById(id);
  }

  @Get('band/:bandId')
  async getContractsByBand(@Param('bandId') bandId: number) {
    return await this.contractService.getContractsByBand(+bandId);
  }

  @Get('venue/:venueId')
  async getContractsByVenue(
    @Param('venueId', new ParseUUIDPipe()) venueId: string,
  ) {
    return await this.contractService.getContractsByVenue(venueId);
  }

  @Patch('confirm/:id')
  async confirmContract(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.contractService.confirmContract(id);
  }

  @Patch('cancel/:id')
  async cancelContract(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.contractService.cancelContract(id);
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteContract(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.contractService.deleteContract(id);
  }
}

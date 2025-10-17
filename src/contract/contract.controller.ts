import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { IsBoolean } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

export class RespondContractDto {
  @IsBoolean()
  accepted: boolean;
}

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

  /**
   * Endpoint para a BANDA aceitar ou recusar um contrato.
   */
  @Patch(':id/respond')
  @UseGuards(AuthGuard('jwt')) // Protege a rota, garantindo que req.user exista
  async respondToContract(
    @Param('id', ParseUUIDPipe) contractId: string,
    @Body() respondContractDto: RespondContractDto,
    @Req() req: Request, // Injetamos o objeto de requisição completo
  ) {
    // 1. Extraímos o objeto 'user' que foi anexado ao request pelo AuthGuard
    const user = req.user as any;

    // 2. Verificamos se o usuário logado é uma banda
    if (user.sub.role !== 'band') {
      throw new ForbiddenException(
        'Apenas bandas podem aceitar ou recusar contratos.',
      );
    }

    // 3. Chamamos o serviço com os dados necessários
    return this.contractService.respondToContract(
      contractId,
      respondContractDto.accepted,
      user.sub.id,
    );
  }

  /**
   * Endpoint para o ESTABELECIMENTO (Venue) cancelar uma proposta enviada.
   */
  @Patch(':id/cancel')
  @UseGuards(AuthGuard('jwt')) // Protege a rota
  async cancelContract(
    @Param('id', ParseUUIDPipe) contractId: string,
    @Req() req: Request, // Injetamos o objeto de requisição
  ) {
    // 1. Extraímos o usuário do request
    const user = req.user as any;
    console.log('Usuário tentando cancelar contrato:', user);
    // 2. Verificamos se o usuário logado é um estabelecimento
    if (user.sub.role !== 'venue') {
      throw new ForbiddenException(
        'Apenas estabelecimentos podem cancelar contratos.',
      );
    }

    // 3. Chamamos o serviço com os dados necessários
    return this.contractService.cancelContract(contractId, user.sub.id);
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteContract(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.contractService.deleteContract(id);
  }
}

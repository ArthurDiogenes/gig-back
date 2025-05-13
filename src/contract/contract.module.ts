import { Module } from '@nestjs/common';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './contract.entity';
import { Band } from 'src/bands/band.entity';
import { Venue } from 'src/venue/venue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, Venue, Band])],
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}

import { Module } from '@nestjs/common';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './contract.entity';
import { Band } from 'src/bands/band.entity';
import { Venue } from 'src/venue/venue.entity';
import { User } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, Venue, Band, User])],
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}

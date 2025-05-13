import { Type } from 'class-transformer';
import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsPositive,
  IsDate,
} from 'class-validator';

export class CreateContractDto {
  @IsString()
  @IsNotEmpty()
  eventName: string;

  @Type(() => Date)
  @IsDate()
  eventDate: Date;

  @IsNotEmpty()
  startTime: string;

  @IsNotEmpty()
  endTime: string;

  @IsString()
  @IsNotEmpty()
  eventType: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  budget: number;

  @IsOptional()
  @IsString()
  additionalDetails?: string;

  @IsOptional()
  @IsBoolean()
  isConfirmed?: boolean;

  @IsUUID()
  requesterId: string;

  @IsNotEmpty()
  providerId: number;
}

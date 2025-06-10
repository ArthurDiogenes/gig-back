import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsNumber,
  IsUrl,
} from 'class-validator';

export class UpdateBandDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  bandName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  city?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  genre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  members?: number;

  @IsOptional()
  @IsUrl()
  twitter?: string;

  @IsOptional()
  @IsUrl()
  instagram?: string;

  @IsOptional()
  @IsUrl()
  facebook?: string;
}

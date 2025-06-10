import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBandDto {
  @IsNotEmpty()
  bandName: string;

  @IsNotEmpty()
  genre: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  twitter?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  facebook?: string;
}

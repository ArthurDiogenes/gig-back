import { IsNotEmpty } from 'class-validator';

export class UpdateBandDto {
  @IsNotEmpty()
  bandName: string;

  @IsNotEmpty()
  genre: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  description: string;
}

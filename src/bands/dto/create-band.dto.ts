import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBandDto {
  @IsNotEmpty()
  bandName: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  genero: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMusicDto {
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;

  @IsNumber({}, { message: 'Band ID must be a number.' })
  @IsNotEmpty({ message: 'Band ID is required.' })
  bandId: number;
}

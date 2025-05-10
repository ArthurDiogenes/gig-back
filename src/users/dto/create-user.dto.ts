import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsIn(['band', 'venue', 'admin'])
  role: 'band' | 'venue' | 'admin';

  // Campos obrigatórios apenas para role = venue
  @ValidateIf((o) => o.role === 'venue')
  @IsString()
  @IsNotEmpty()
  venue: string;

  @ValidateIf((o) => o.role === 'venue')
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @ValidateIf((o) => o.role === 'venue')
  @IsString()
  @IsNotEmpty()
  cep: string;

  @ValidateIf((o) => o.role === 'venue')
  @IsString()
  @IsNotEmpty()
  address: string;

  // Campos obrigatórios para band e venue
  @ValidateIf((o) => o.role === 'venue' || o.role === 'band')
  @IsString()
  @IsNotEmpty()
  city: string;

  // Campos obrigatórios apenas para role = band
  @ValidateIf((o) => o.role === 'band')
  @IsString()
  @IsNotEmpty()
  bandName: string;

  @ValidateIf((o) => o.role === 'band')
  @IsString()
  @IsNotEmpty()
  genero: string;
}

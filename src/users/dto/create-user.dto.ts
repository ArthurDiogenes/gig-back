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

  @IsNotEmpty()
  @IsString()
  name: string;

  @ValidateIf((o) => o.role === 'venue')
  @IsString()
  @IsNotEmpty()
  type: string;

  @ValidateIf((o) => o.role === 'venue')
  @IsString()
  @IsNotEmpty()
  cep: string;

  @ValidateIf((o) => o.role === 'venue')
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  // Campos obrigatórios apenas para role = band

  @ValidateIf((o) => o.role === 'band')
  @IsString()
  @IsNotEmpty()
  genre: string;
}

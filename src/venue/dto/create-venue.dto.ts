import { IsNotEmpty, IsString } from "class-validator";

export class CreateVenueDto {
    @IsNotEmpty()
    @IsString()
    venue: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    cep: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsString()
    address: string;

}

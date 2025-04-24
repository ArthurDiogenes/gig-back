import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcryptjs from 'bcryptjs';
import { Response } from 'express';
import { VenueService } from 'src/venue/venue.service';
import { BandsService } from 'src/bands/bands.service';
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly venueService: VenueService,
    private readonly bandService: BandsService,
  ) {}

  async getUserByEmail(email: string) {
    this.logger.log(`Getting user with email: ${email}`);
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(body: CreateUserDto, res: Response) {
    this.logger.log(body);
    if (!body.email || !body.password || !body.role) {
      this.logger.log('Campos obrigatórios não preenchidos');
      throw new BadRequestException(
        'Campos obrigatórios não preenchidos. Campos: email, password e role',
      );
    }

    const existingUser = await this.getUserByEmail(body.email);
    if (existingUser) {
      this.logger.log(`User already exists with email: ${body.email}`);
      throw new ConflictException('Email já cadastrado');
    }
    this.logger.log(`Creating user with email: ${body.email}`);
    const salt = bcryptjs.genSaltSync(10);
    const password = bcryptjs.hashSync(body.password, salt);
    const user = await this.userRepository.save({
      email: body.email,
      password,
      role: body.role,
    });
    this.logger.log(`User created with id: ${user.id}`);

    if (body.role == 'venue') {
      const venueBody = {
        name: body.venue,
        type: body.tipo,
        cep: body.cep,
        city: body.city,
        address: body.address,
      };
      return await this.venueService.create(venueBody, res);
    } else {
      const bandBody = {
        bandName: body.bandName,
        city: body.city,
        genero: body.genero,
      };
      return await this.bandService.create(bandBody, res);
    }
  }
}

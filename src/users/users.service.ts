import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcryptjs from 'bcryptjs';
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

  async createUser(body: CreateUserDto) {
    const { email, password, role, name } = body;

    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      this.logger.warn(`Email já cadastrado: ${email}`);
      throw new ConflictException('Email já cadastrado');
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await this.userRepository.save({
      email,
      name,
      password: hashedPassword,
      role,
    });

    this.logger.log(`Usuário criado: ${user.id} (${role})`);

    if (role === 'venue') {
      return this.venueService.create({
        name: body.name,
        type: body.type,
        cep: body.cep,
        city: body.city,
        address: body.address,
        userId: user.id,
      });
    }

    if (role === 'band') {
      return this.bandService.create({
        bandName: body.name,
        genre: body.genre,
        city: body.city,
        userId: user.id,
      });
    }

    return { message: 'Usuário admin criado com sucesso', user };
  }
}

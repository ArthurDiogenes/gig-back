import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserByEmail(email: string) {
    this.logger.log(`Getting user with email: ${email}`);
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(body: CreateUserDto) {
    this.logger.log(`Creating user with email: ${body.email}`);
    const salt = bcryptjs.genSaltSync(10);
    const password = bcryptjs.hashSync(body.password, salt);
    return await this.userRepository.save({
      ...body,
      password,
    });
  }
}

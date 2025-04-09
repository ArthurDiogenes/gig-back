import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcryptjs from 'bcryptjs';
import { Response } from 'express';
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

  async createUser(body: CreateUserDto, res: Response) {
    if(!body.email || !body.password || !body.role) {
      this.logger.log('Campos obrigatórios não preenchidos');
      throw new BadRequestException('Campos obrigatórios não preenchidos. Campos: email, password e role');
    }

    const existingUser = await this.getUserByEmail(body.email);
    if (existingUser) {
      this.logger.log(`User already exists with email: ${body.email}`);
      throw new ConflictException('Email já cadastrado');
    }
    this.logger.log(`Creating user with email: ${body.email}`);
    const salt = bcryptjs.genSaltSync(10);
    const password = bcryptjs.hashSync(body.password, salt);
    await this.userRepository.save({
      ...body,
      password,
    });
    return res.status(201).send({
      message: 'Usuário criado com sucesso',
    });
  }
}

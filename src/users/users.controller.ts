import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt')) // Use o guarda de autenticação JWT ou outro que você tenha configurado
  async getMe(@Req() req: Request) {
    const user = req.user as any; // O objeto de usuário injetado pelo AuthGuard
    return this.usersService.getMe(user.sub.id);
  }

  @Get('/email/:email')
  getUserByEmail(email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }
}

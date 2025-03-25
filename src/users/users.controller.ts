import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/email/:email')
  getUserByEmail(email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Post()
  createUser(@Body() body: CreateUserDto, @Res() res: Response) {
    return this.usersService.createUser(body, res);
  }
}

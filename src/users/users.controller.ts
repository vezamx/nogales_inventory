import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreateDto } from './dto/user_create.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('/')
  async find() {
    return await this.usersService.find();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Post('/')
  async create(@Body() userData: UserCreateDto) {
    return await this.usersService.create(userData);
  }
}

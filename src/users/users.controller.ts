import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
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
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Post('/')
  async create(@Body() userData: UserCreateDto) {
    return await this.usersService.create(userData);
  }
}

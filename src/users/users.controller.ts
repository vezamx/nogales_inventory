import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreateDto } from './dto/user_create.dto';
import { AuthGuard } from '../guards/authentication.guard';
import { TransactionsInterceptor } from '../interceptors/transactions.interceptor';
import { NotTransactable } from '../decorators/notTransactable.decorator';

@UseGuards(AuthGuard)
@UseInterceptors(TransactionsInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @NotTransactable()
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

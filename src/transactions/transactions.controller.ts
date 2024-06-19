import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from 'src/guards/authentication.guard';

@UseGuards(AuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('/')
  async find() {
    return this.transactionsService.find();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }
}

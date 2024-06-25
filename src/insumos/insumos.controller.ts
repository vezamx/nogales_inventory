import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InsumoCreateDto } from './dto/insumoCreate.dto';
import { InsumoUpdateDto } from './dto/insumoUpdate.dto';
import { InsumosService } from './insumos.service';
import { TransactionsInterceptor } from '../interceptors/transactions.interceptor';
import { AuthGuard } from '../guards/authentication.guard';
import { NotTransactable } from '../decorators/notTransactable.decorator';

@UseGuards(AuthGuard)
@UseInterceptors(TransactionsInterceptor)
@Controller('insumos')
export class InsumosController {
  constructor(private readonly insumosService: InsumosService) {}

  @NotTransactable()
  @Get()
  async find() {
    return await this.insumosService.find();
  }
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.insumosService.findOne(id);
  }

  @Post('/')
  async create(@Body() insumoCreateData: InsumoCreateDto) {
    return await this.insumosService.create(insumoCreateData);
  }

  @Put('/:id')
  async update(id: string, @Body() insumoUpdateData: InsumoUpdateDto) {
    return await this.insumosService.update(id, insumoUpdateData);
  }
}

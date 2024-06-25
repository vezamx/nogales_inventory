import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { AuthGuard } from '../guards/authentication.guard';
import { ProductosCreateDto } from './dto/productosCreate.dto';
import { CustomRequest } from '../utils/types';
import { ProductoUpdateDto } from './dto/producto.update';
import { TransactionsInterceptor } from '../interceptors/transactions.interceptor';
import { NotTransactable } from '../decorators/notTransactable.decorator';

@UseGuards(AuthGuard)
@UseInterceptors(TransactionsInterceptor)
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @NotTransactable()
  @Get('/')
  async find() {
    return await this.productosService.find();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.productosService.findOne(id);
  }

  @Post('/')
  async create(
    @Body() productoData: ProductosCreateDto,
    @Req() req: CustomRequest,
  ) {
    return await this.productosService.create(productoData, req.user);
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() productoData: ProductoUpdateDto,
    @Req() req: CustomRequest,
  ) {
    return await this.productosService.update(id, productoData, req.user);
  }
}

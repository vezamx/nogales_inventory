import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ComandasService } from './comandas.service';
import { ComandasGetQueryDto } from './dto/comandasGetQuery.dto';
import { ComandaCreateDto } from './dto/comandaCreate.dto';
import { AuthGuard } from '../guards/authentication.guard';
import { TransactionsInterceptor } from '../interceptors/transactions.interceptor';
import { CustomRequest } from '../utils/types';
import { GirarDescuentoDto } from './dto/girarDescuento.dto';
import { AddProductoToComandaDto } from './dto/addProductoToComanda.dto';
import { CloseComandaDto } from './dto/closeComanda.dto';
import { ComandaDividirDto } from './dto/comandaDividir.dto';

@UseInterceptors(TransactionsInterceptor)
@UseGuards(AuthGuard)
@Controller('comandas')
export class ComandasController {
  constructor(private readonly comandasService: ComandasService) {}

  @Get('/')
  async getComandas(@Query() comandasQuery: ComandasGetQueryDto) {
    return this.comandasService.find(comandasQuery);
  }

  @Get('/:id')
  async getComanda(@Param() id: string) {
    return this.comandasService.findOne(id);
  }

  @Post('/')
  async createComanda(
    @Body() comandaData: ComandaCreateDto,
    @Req() req: CustomRequest,
  ) {
    return this.comandasService.create(comandaData, req.user);
  }

  @Put('/dividir/:id')
  async dividirComanda(
    @Param('id') id: string,
    @Body() comandaData: ComandaDividirDto,
    @Req() req: CustomRequest,
  ) {
    return this.comandasService.dividirComanda(comandaData, id, req.user);
  }

  @Put('/productos/:id')
  async addProducto(
    @Param('id') id: string,
    @Body() productoData: AddProductoToComandaDto,
  ) {
    return this.comandasService.addProductToComanda(id, productoData);
  }

  @Put('/close/:id')
  async closeComanda(
    @Param('id') id: string,
    @Body() { isPaymentPending }: CloseComandaDto,
  ) {
    return this.comandasService.closeComanda(id, isPaymentPending);
  }

  @Patch('/:id')
  async girarDescuento(
    @Body() descuentoData: GirarDescuentoDto,
    @Param('id') id: string,
    @Req() req: CustomRequest,
  ) {
    return this.comandasService.girarDescuento(id, descuentoData, req.user);
  }
}

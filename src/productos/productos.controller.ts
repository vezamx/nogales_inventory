import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { AuthGuard } from 'src/guards/authentication.guard';
import { ProductosCreateDto } from './dto/productosCreate.dto';
import { CustomRequest } from 'src/utils/types';

@UseGuards(AuthGuard)
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}
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
    console.log(req.user, 'Aqui esta el usuario');
    return await this.productosService.create(productoData);
  }
}

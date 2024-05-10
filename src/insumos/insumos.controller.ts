import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { InsumosService } from './insumos.service';
import { InsumoCreateDto } from './dto/insumoCreate.dto';
import { InsumoUpdateDto } from './dto/insumoUpdate.dto';

@Controller('insumos')
export class InsumosController {
  constructor(private readonly insumosService: InsumosService) {}

  @Get()
  async find() {
    return await this.insumosService.find();
  }
  @Get('/:id')
  async findOne(id: string) {
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

  @Patch('/:idProducto')
  async dropProductInsumos(@Param('idProducto') idProducto: string) {
    return await this.insumosService.dropProductInsumos(idProducto);
  }
}

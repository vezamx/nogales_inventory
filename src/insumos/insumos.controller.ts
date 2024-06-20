import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { InsumoCreateDto } from './dto/insumoCreate.dto';
import { InsumoUpdateDto } from './dto/insumoUpdate.dto';
import { InsumosService } from './insumos.service';

@Controller('insumos')
export class InsumosController {
  constructor(private readonly insumosService: InsumosService) {}

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

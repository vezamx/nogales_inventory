import { Controller, Get } from '@nestjs/common';
import { InsumosService } from './insumos.service';

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
}

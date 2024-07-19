import { Controller, Delete, Get, Post } from '@nestjs/common';
import { MesasService } from './mesas.service';
import { Mesa } from '../entities/mesa.entity';
import { MesaCreateDto } from './dto/mesaCreate.dto';
import { Seccion } from '../entities/seccion.entity';
import { SeccionCreateDto } from './dto/seccionCreate.dto';
import { CommonAPIResponse } from '../utils/types';

@Controller('mesas')
export class MesasController {
  constructor(private readonly mesasService: MesasService) {}

  @Get('/')
  async find(): Promise<Mesa[]> {
    return await this.mesasService.find();
  }

  @Get('/:id')
  async findOne(id: string): Promise<Mesa> {
    return await this.mesasService.findOne(id);
  }

  @Post('/')
  async create(data: MesaCreateDto): Promise<Mesa> {
    return await this.mesasService.create(data);
  }

  @Post('/seccion')
  async createSeccion(data: SeccionCreateDto): Promise<Seccion> {
    return await this.mesasService.createSeccion(data);
  }

  @Delete('/seccion/:id')
  async deleteSeccion(id: string): Promise<CommonAPIResponse<Seccion>> {
    return await this.mesasService.deleteSeccion(id);
  }

  @Delete('/:id')
  async deleteMesa(id: string): Promise<CommonAPIResponse<Mesa>> {
    return await this.mesasService.deleteMesa(id);
  }
}

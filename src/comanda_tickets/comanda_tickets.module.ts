import { Module } from '@nestjs/common';
import { ComandaTicketsService } from './comanda_tickets.service';
import { ProductosService } from '../productos/productos.service';
import { InsumosService } from '../insumos/insumos.service';

@Module({
  providers: [ComandaTicketsService, ProductosService, InsumosService],
})
export class ComandaTicketsModule {}

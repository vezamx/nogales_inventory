import { Module } from '@nestjs/common';
import { ComandasController } from './comandas.controller';
import { ComandasService } from './comandas.service';
import { ProductosService } from '../productos/productos.service';
import { InsumosService } from '../insumos/insumos.service';
import { ComandaTicketsService } from '../comanda_tickets/comanda_tickets.service';

@Module({
  controllers: [ComandasController],
  providers: [
    ComandasService,
    ProductosService,
    InsumosService,
    ComandaTicketsService,
  ],
})
export class ComandasModule {}

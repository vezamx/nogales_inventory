import { Module } from '@nestjs/common';
import { ComandasController } from './comandas.controller';
import { ComandasService } from './comandas.service';
import { ProductosService } from 'src/productos/productos.service';
import { InsumosService } from 'src/insumos/insumos.service';
import { ComandaTicketsService } from 'src/comanda_tickets/comanda_tickets.service';

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

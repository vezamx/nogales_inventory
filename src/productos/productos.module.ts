import { Module } from '@nestjs/common';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { InsumosService } from '../insumos/insumos.service';
import { TransactionsService } from '../transactions/transactions.service';

@Module({
  controllers: [ProductosController],
  providers: [ProductosService, InsumosService, TransactionsService],
  exports: [ProductosService],
})
export class ProductosModule {}

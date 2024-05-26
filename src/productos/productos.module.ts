import { Module } from '@nestjs/common';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { InsumosService } from 'src/insumos/insumos.service';

@Module({
  controllers: [ProductosController],
  providers: [ProductosService, InsumosService],
})
export class ProductosModule {}

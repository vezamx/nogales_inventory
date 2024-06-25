import { Module } from '@nestjs/common';
import { InsumosController } from './insumos.controller';
import { InsumosService } from './insumos.service';
import { TransactionsService } from '../transactions/transactions.service';

@Module({
  controllers: [InsumosController],
  providers: [InsumosService, TransactionsService],
})
export class InsumosModule {}

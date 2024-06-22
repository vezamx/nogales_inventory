import { Global, Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { RolesService } from 'src/roles/roles.service';

@Global()
@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, RolesService],
  exports: [TransactionsService],
})
export class TransactionsModule {}

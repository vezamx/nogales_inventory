import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { InsumosModule } from './insumos/insumos.module';
import { ProductosModule } from './productos/productos.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { RolesService } from './roles/roles.service';
import { TransactionsModule } from './transactions/transactions.module';
import { ComandasModule } from './comandas/comandas.module';
import { ComandaTicketsModule } from './comanda_tickets/comanda_tickets.module';
import { MesasModule } from './mesas/mesas.module';
@Module({
  imports: [
    MikroOrmModule.forRoot(),
    RolesModule,
    AuthModule,
    UsersModule,
    InsumosModule,
    ProductosModule,
    TransactionsModule,
    ComandasModule,
    ComandaTicketsModule,
    MesasModule,
  ],
  providers: [RolesService],
})
export class AppModule {}

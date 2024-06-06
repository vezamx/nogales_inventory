import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InsumosModule } from './insumos/insumos.module';
import { ProductosModule } from './productos/productos.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    AuthModule,
    UsersModule,
    InsumosModule,
    ProductosModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

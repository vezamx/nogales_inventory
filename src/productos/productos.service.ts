import { EntityManager } from '@mikro-orm/mongodb';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Productos } from 'src/entities/productos.entity';
import { ERROR_MESSAGES } from 'src/utils/constants';
import { ProductosCreateDto } from './dto/productosCreate.dto';

@Injectable()
export class ProductosService {
  logger = new Logger(ProductosService.name);

  constructor(private readonly em: EntityManager) {}
  async find() {
    return await this.em.fork().find(Productos, {});
  }

  async findOne(id: string) {
    const producto = await this.em.fork().findOne(Productos, { id });

    if (!producto) {
      throw new BadRequestException(ERROR_MESSAGES.BAD_REQUEST);
    }

    return producto;
  }
  async create(productoData: ProductosCreateDto) {
    this.logger.log('Creating a new product, ', productoData);
    //TODO: Implementar la creacion de un producto
    return { message: 'Producto creado correctamente' };
  }
}

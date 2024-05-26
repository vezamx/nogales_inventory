import { EntityManager, wrap } from '@mikro-orm/mongodb';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Productos } from '../entities/productos.entity';
import { ERROR_MESSAGES } from '../utils/constants';
import { ProductosCreateDto } from './dto/productosCreate.dto';
import { User } from '../entities/user.entity';
import { Insumos } from '../entities/insumos.entity';
import { InsumosService } from '../insumos/insumos.service';
import { ProductoUpdateDto } from './dto/producto.update';

@Injectable()
export class ProductosService {
  logger = new Logger(ProductosService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly insumosSerivice: InsumosService,
  ) {}
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
  async create(productoData: ProductosCreateDto, userId: string) {
    const user = await this.em.fork().findOne(User, { id: userId });

    if (!user) {
      throw new BadRequestException(ERROR_MESSAGES.BAD_REQUEST);
    }
    const { insumos, ...dataProducto } = productoData;

    const producto = this.em.create(Productos, dataProducto);

    const insumosArray = await Promise.all(
      insumos.map(async (insumoObj) => {
        return await this.em.fork().findOne(Insumos, { id: insumoObj.id });
      }),
    );

    insumosArray.forEach((insumo) => {
      producto.insumos.add(insumo);
    });

    producto.createdBy = user;
    producto.updatedBy = user;

    await this.em.persistAndFlush(producto);

    //TODO: Implementar servicio de transacciones para guardar todos los eventos y loggearlos

    return producto;
  }

  async update(id: string, productoData: ProductoUpdateDto, userId: string) {
    try {
      const user = await this.em.fork().findOneOrFail(User, { id: userId });

      const producto = await this.em.fork().findOneOrFail(Productos, { id });

      this.em.assign(producto, ProductoUpdateDto as Partial<User>, {
        mergeObjectProperties: true,
      });

      producto.updatedBy = user;

      await this.em.persistAndFlush(producto);
      return producto;
    } catch (error) {
      throw new BadRequestException(ERROR_MESSAGES.BAD_REQUEST);
    }
  }
}

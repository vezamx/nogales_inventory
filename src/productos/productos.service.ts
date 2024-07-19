import { EntityManager } from '@mikro-orm/mongodb';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Insumos } from '../entities/insumos.entity';
import {
  Productos,
  Productos_Ingredientes,
} from '../entities/productos.entity';
import { User } from '../entities/user.entity';
import { ERROR_MESSAGES } from '../utils/constants';
import { ProductoUpdateDto } from './dto/producto.update';
import { ProductosCreateDto } from './dto/productosCreate.dto';
import { InsumosService } from '../insumos/insumos.service';

@Injectable()
export class ProductosService {
  logger = new Logger(ProductosService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly insumosService: InsumosService,
  ) {}
  async find() {
    return await this.em.fork().find(Productos, {});
  }

  async findOne(id: string): Promise<Productos> {
    const producto = await this.em
      .fork()
      .findOne(Productos, { id }, { populate: ['insumos'] });

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

    const insumosArray: Productos_Ingredientes[] = await Promise.all(
      insumos.map(async (insumoObj) => {
        const ins = await this.em.fork().findOne(Insumos, { id: insumoObj.id });
        const insumoProducto = this.em.create(Productos_Ingredientes, {
          insumo: ins,
          cantidad: insumoObj.cantidad,
        });
        return insumoProducto;
      }),
    );

    insumosArray.forEach((insumo) => {
      producto.insumos.add(insumo);
    });

    producto.createdBy = user;
    producto.updatedBy = user;

    await this.em.persistAndFlush(producto);

    return producto;
  }

  async update(id: string, productoData: ProductoUpdateDto, userId: string) {
    try {
      const user = await this.em.fork().findOneOrFail(User, { id: userId });

      const producto = await this.em.fork().findOneOrFail(Productos, { id });

      this.em.assign(producto, productoData as Partial<User>, {
        mergeObjectProperties: true,
      });

      producto.updatedBy = user;

      await this.em.persistAndFlush(producto);
      return producto;
    } catch (error) {
      throw new BadRequestException(ERROR_MESSAGES.BAD_REQUEST);
    }
  }

  async sellProduct(id: string) {
    try {
      const producto = await this.em
        .fork()
        .findOneOrFail(
          Productos,
          { id },
          { populate: ['insumos', 'insumos.insumo'] },
        );

      producto.insumos.getItems().forEach(async (insumo) => {
        this.insumosService.update(insumo.insumo.id, {
          operacion: 'substract',
          cantidad: insumo.cantidad,
        });
      });

      return {
        message: 'Producto vendido',
      };
    } catch (error) {
      throw new BadRequestException(ERROR_MESSAGES.BAD_REQUEST);
    }
  }
}

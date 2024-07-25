import { EntityManager } from '@mikro-orm/mongodb';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Mesa } from '../entities/mesa.entity';
import { MesaCreateDto } from './dto/mesaCreate.dto';
import { Seccion } from '../entities/seccion.entity';
import { ERROR_MESSAGES } from '../utils/constants';
import { SeccionCreateDto } from './dto/seccionCreate.dto';
import { Comanda, EStatusComanda } from '../entities/comandas.entity';
import { CommonAPIResponse } from '../utils/types';

@Injectable()
export class MesasService {
  constructor(private readonly em: EntityManager) {}

  private logger = new Logger(MesasService.name);

  async find(): Promise<Mesa[]> {
    return await this.em.fork().find(Mesa, {});
  }

  async findOne(id: string): Promise<Mesa> {
    try {
      const mesa = await this.em.fork().findOneOrFail(Mesa, { id });

      return mesa;
    } catch (e) {
      this.logger.error(e);
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
  }

  async create(data: MesaCreateDto): Promise<Mesa> {
    try {
      const seccion = await this.em.fork().findOneOrFail(Seccion, {
        id: data.seccion,
      });

      const mesa = this.em.fork().create(Mesa, {
        nombre: data.nombre,
        seccion,
      });

      await this.em.fork().persistAndFlush(mesa);

      return mesa;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(ERROR_MESSAGES.BAD_REQUEST);
    }
  }

  async createSeccion(data: SeccionCreateDto): Promise<Seccion> {
    try {
      const seccion = this.em.fork().create(Seccion, {
        nombre: data.nombre,
      });
      await this.em.fork().persistAndFlush(seccion);

      return seccion;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(ERROR_MESSAGES.BAD_REQUEST);
    }
  }

  async deleteMesa(id: string): Promise<CommonAPIResponse<Mesa>> {
    try {
      const mesa = await this.em.fork().findOneOrFail(Mesa, { id });

      const activeComandas = await this.em.fork().count(Comanda, {
        mesa: id,
        status: { $ne: EStatusComanda.TERMINADA_CANCELADA },
      });
      if (activeComandas > 0) {
        throw new BadRequestException(ERROR_MESSAGES.MESA_HAS_COMANDAS);
      }

      await this.em.fork().removeAndFlush(mesa);

      return {
        ok: true,
        message: 'Mesa eliminada correctamente.',
        data: mesa,
      };
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(ERROR_MESSAGES.BAD_REQUEST);
    }
  }

  async deleteSeccion(
    id: string,
    force?: boolean,
  ): Promise<CommonAPIResponse<Seccion>> {
    try {
      if (force) {
        const seccion = await this.em.fork().findOneOrFail(Seccion, { id });
        const mesas = await this.em.fork().find(Mesa, { seccion: id });
        await this.em.fork().removeAndFlush([seccion, ...mesas]);

        this.logger.warn(ERROR_MESSAGES.WARNING_SECTIONS_DELETE);

        return {
          ok: true,
          message: 'Sección eliminada correctamente.',
          data: seccion,
        };
      }

      const seccion = await this.em.fork().findOneOrFail(Seccion, { id });
      const mesas = await this.em.fork().count(Mesa, { seccion: id });
      if (mesas > 0) {
        throw new BadRequestException(ERROR_MESSAGES.MESA_HAS_COMANDAS);
      }
      await this.em.fork().removeAndFlush(seccion);
      return {
        ok: true,
        message: 'Sección eliminada correctamente.',
        data: seccion,
      };
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(ERROR_MESSAGES.BAD_REQUEST);
    }
  }
}

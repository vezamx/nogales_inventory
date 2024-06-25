import { EntityManager } from '@mikro-orm/mongodb';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Insumos } from '../entities/insumos.entity';
import { InsumoCreateDto } from './dto/insumoCreate.dto';
import { InsumoUpdateDto } from './dto/insumoUpdate.dto';
import { ERROR_MESSAGES, MODELS } from '../utils/constants';
import { FormatResourceChangeMessage } from '../utils/messageFormatter';

@Injectable()
export class InsumosService {
  constructor(private readonly em: EntityManager) {}

  private logger = new Logger('InsumosService');

  async find() {
    return await this.em.find(Insumos, {});
  }

  async findOne(id: string) {
    const insumo = await this.em.findOne(Insumos, { id });

    if (!insumo) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    return insumo;
  }

  async create(insumoData: InsumoCreateDto) {
    try {
      const insumo = this.em.create(Insumos, insumoData);
      await this.em.persistAndFlush(insumo);

      this.logger.log(FormatResourceChangeMessage(MODELS.INSUMOS, 'create'));

      return insumo;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, insumoData: InsumoUpdateDto) {
    try {
      const insumo = await this.em.findOne(Insumos, { id });
      if (!insumo) {
        throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
      }
      switch (insumoData.operacion) {
        case 'add':
          insumo.cantidad += insumoData.cantidad;
          break;
        case 'substract':
          insumo.cantidad -= insumoData.cantidad;
          break;
        case 'set':
          insumo.cantidad = insumoData.cantidad;
          break;
        default:
          throw new BadRequestException(ERROR_MESSAGES.INVALID_OPERATION);
      }
      this.logger.log(FormatResourceChangeMessage(MODELS.INSUMOS, 'update'));
      await this.em.persistAndFlush(insumo);

      return insumo;
    } catch (error) {
      this.logger.error(error.message);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      } else throw new InternalServerErrorException(error.message);
    }
  }
}

import { EntityManager } from '@mikro-orm/mongodb';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ComandasGetQueryDto } from './dto/comandasGetQuery.dto';
import { Comanda, Comanda_Descuento } from '../entities/comandas.entity';
import { ComandaCreateDto } from './dto/comandaCreate.dto';
import { ERROR_MESSAGES } from '../utils/constants';
import { User } from '../entities/user.entity';
import { Productos } from '../entities/productos.entity';
import { GirarDescuentoDto } from './dto/girarDescuento.dto';
import { AddProductoToComandaDto } from './dto/addProductoToComanda.dto';
import { ComandaTicketsService } from '../comanda_tickets/comanda_tickets.service';
import { Mesa } from '../entities/mesa.entity';
import { ComandaDividirDto } from './dto/comandaDividir.dto';
import { CommonAPIResponse } from '../utils/types';
import { UnirComandasDto } from './dto/unirComandas.dto';

@Injectable()
export class ComandasService {
  constructor(
    private readonly em: EntityManager,
    private readonly comandaTicketService: ComandaTicketsService,
  ) {}

  private logger = new Logger(ComandasService.name);

  async find({ limit, sort, offset, status }: ComandasGetQueryDto) {
    const comandasQuery = status ? { status } : {};
    return this.em.find(Comanda, comandasQuery, {
      limit,
      offset,
      orderBy: { createdAt: sort },
    });
  }

  async findOne(id: string) {
    const comanda = await this.em.findOne(Comanda, id);
    if (!comanda) {
      this.logger.error(`Comanda with id ${id} not found`);
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    return comanda;
  }

  async create(comandaData: ComandaCreateDto, userId: string) {
    try {
      const user = await this.em.findOne(User, userId);
      if (!user) {
        this.logger.error(
          `User with id ${userId} not found, while creating comanda`,
        );
        throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
      }

      const mesa = await this.em.findOne(Mesa, {
        id: comandaData.mesaId,
      });

      const comandasEnMesa = await this.em.fork().count(Comanda, {
        mesa: mesa,
        status: {
          $in: ['abierta'],
        },
      });

      if (comandasEnMesa > 0) {
        this.logger.error('Mesa already has an open comanda');
        throw new NotAcceptableException(ERROR_MESSAGES.MESA_HAS_COMANDA);
      }

      const comanda = this.em.create(Comanda, comandaData);

      comanda.status = 'abierta';
      comanda.mesa = mesa;
      comanda.createdBy = user;
      comanda.updatedBy = user;

      await this.em.persistAndFlush(comanda);
      return comanda;
    } catch (error) {
      this.logger.error(`Error creating comanda: ${error}`);
      if (
        error instanceof NotAcceptableException ||
        error instanceof ForbiddenException
      )
        throw error;

      throw new BadRequestException(ERROR_MESSAGES.BAD_REQUEST);
    }
  }

  async addProductToComanda(
    comandaId: string,
    { productos }: AddProductoToComandaDto,
  ) {
    const comanda = await this.em.findOne(Comanda, comandaId);
    if (!comanda) {
      this.logger.error("Can't add product to comanda, comanda not found");
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    let invalidProducts = 0;
    for (const productoId of productos) {
      const producto = await this.em.findOne(Productos, productoId);
      if (!producto) {
        invalidProducts++;
        this.logger.error("Can't add product to comanda, product not found");
        throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
      }
      comanda.productos.add(producto);
    }

    await this.em.persistAndFlush(comanda);
    return {
      message: 'Operación exitosa',
      errors: invalidProducts,
    };
  }

  async closeComanda(comandaId: string, isPaymentPending: boolean) {
    try {
      const comanda = await this.em.findOne(Comanda, comandaId, {
        populate: ['productos', 'descuento'],
      });
      if (!comanda) {
        this.logger.error("Can't close comanda, comanda not found");
        throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
      }

      if (comanda.status.includes('terminada')) {
        this.logger.error('Comanda already closed');
        throw new NotAcceptableException(ERROR_MESSAGES.COMANDA_CLOSED);
      }

      if (isPaymentPending) {
        comanda.status = 'terminada_pendiente_pago';
      } else {
        comanda.status = 'terminada_pagada';
      }

      await this.comandaTicketService.createTicket(comanda);

      await this.em.persistAndFlush(comanda);

      return {
        message: 'Comanda cerrada con éxito',
      };
    } catch (error) {
      if (
        error instanceof NotAcceptableException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      this.logger.error(`Error closing comanda: ${error}`);
      throw new InternalServerErrorException(ERROR_MESSAGES.BAD_REQUEST);
    }
  }

  async girarDescuento(
    comandaId: string,
    { descuento, isPercentage, motivo }: GirarDescuentoDto,
    userId: string,
  ) {
    try {
      const user = await this.em.findOne(User, { id: userId });

      if (!user) {
        this.logger.error(
          `User with id ${user} not found, while closing comanda`,
        );
        throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
      }

      const comanda = await this.em.findOne(Comanda, comandaId);
      if (!comanda) {
        this.logger.error("Can't add product to comanda, comanda not found");
        throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
      }
      comanda.descuento = this.em.create(Comanda_Descuento, {
        descuento,
        isPercent: isPercentage,
        motivo,
        approbedBy: user,
      });
      await this.em.persistAndFlush(comanda);
      return {
        message: 'Descuento aplicado con éxito',
      };
    } catch (error) {
      this.logger.error(`Error applying discount: ${error}`);
      throw new BadRequestException(ERROR_MESSAGES.BAD_REQUEST);
    }
  }

  async dividirComanda(
    { productosIds }: ComandaDividirDto,
    comandaId: string,
    userId: string,
  ): Promise<CommonAPIResponse<Comanda>> {
    try {
      const user = await this.em.findOne(User, { id: userId });

      if (!user) {
        this.logger.error(
          `User with id ${userId} not found, while closing comanda`,
        );
        throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
      }

      const comanda = await this.em.findOne(
        Comanda,
        { id: comandaId },
        { populate: ['productos'] },
      );

      if (!comanda) throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);

      const { id, _id, productos, ...comandaData } = comanda;

      const newComanda = this.em.create(Comanda, comandaData);

      const newProductos = comanda.productos.filter((producto) => {
        return productosIds.includes(producto.id);
      });

      for (const producto of newProductos) {
        comanda.productos.remove(producto);
        newComanda.productos.add(producto);
      }

      if (newComanda.productos.count() === 0) {
        throw new NotAcceptableException(ERROR_MESSAGES.BAD_REQUEST);
      }

      comanda.updatedBy = user;
      newComanda.updatedBy = user;

      this.em.persist(comanda);
      this.em.persist(newComanda);

      await this.em.flush();

      if (newComanda.productos.count() < productosIds.length) {
        return {
          ok: true,
          message: 'Algunos productos no se pudieron dividir',
          data: newComanda,
        };
      }

      return {
        ok: true,
        message: 'Comanda dividida con éxito',
        data: newComanda,
      };
    } catch (error) {
      this.logger.error(`Error dividiando comanda: ${error}`);
      if (
        error instanceof NotAcceptableException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(ERROR_MESSAGES.BAD_REQUEST);
    }
  }

  async joinComandas(
    { comandaId, comandaIdToJoin }: UnirComandasDto,
    userId: string,
  ): Promise<CommonAPIResponse<Comanda>> {
    try {
      const user = await this.em.findOne(User, { id: userId });

      if (!user) throw new ForbiddenException(ERROR_MESSAGES.NOT_FOUND);

      const comanda = await this.em.findOne(
        Comanda,
        { id: comandaId },
        { populate: ['productos', 'mesasAdjuntas'] },
      );
      if (!comanda) throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
      const comandaToJoin = await this.em.findOne(
        Comanda,
        { id: comandaIdToJoin },
        { populate: ['productos'] },
      );
      if (!comandaToJoin) throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
      comandaToJoin.productos.getItems().forEach((producto) => {
        comanda.productos.add(producto);
      });

      comanda.mesasAdjuntas.add(comandaToJoin.mesa);
      comanda.updatedBy = user;
      comandaToJoin.status = 'cancelada_unida';

      this.em.persist(comanda);
      this.em.persist(comandaToJoin);

      await this.em.flush();
      return {
        ok: true,
        message: 'Comandas unidas con éxito',
        data: comanda,
      };
    } catch (error) {
      this.logger.error(`Error uniendo comandas: ${error}`);
      if (
        error instanceof NotAcceptableException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException(ERROR_MESSAGES.BAD_REQUEST);
    }
  }
}

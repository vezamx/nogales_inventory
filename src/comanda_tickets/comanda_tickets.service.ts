import { EntityManager } from '@mikro-orm/mongodb';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Comanda, Comanda_Tickets } from '../entities/comandas.entity';
import { ProductosService } from '../productos/productos.service';
import { ERROR_MESSAGES } from '../utils/constants';

@Injectable()
export class ComandaTicketsService {
  constructor(
    private readonly em: EntityManager,
    private readonly productoService: ProductosService,
  ) {}

  async createTicket(comanda: Comanda) {
    try {
      const subTotal = comanda.productos.reduce((acc, curr) => {
        return acc + curr.costo;
      }, 0);

      const total = comanda.descuento
        ? comanda.descuento.isPercent
          ? subTotal - (subTotal * comanda.descuento.descuento) / 100
          : subTotal - comanda.descuento.descuento
        : subTotal;

      const descuentos: number = comanda.descuento.isPercent
        ? (subTotal * comanda.descuento.descuento) / 100
        : comanda.descuento.descuento;

      for (let i = 0; i < comanda.productos.length; i++) {
        await this.productoService.sellProduct(comanda.productos[i].id);
      }

      const ticket = this.em.create(Comanda_Tickets, {
        comanda,
        subtotal: subTotal,
        total,
        descuentos,
      });

      await this.em.persistAndFlush(ticket);
      return ticket;
    } catch (error) {
      throw new InternalServerErrorException(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

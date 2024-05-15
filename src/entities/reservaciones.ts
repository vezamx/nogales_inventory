import {
  Entity,
  Property,
} from '@mikro-orm/core';
import { BaseEntityData } from './base';

@Entity()
export class Reservaciones extends BaseEntityData{
  @Property()
  nombreResevacion: string;//A nombre de quien es la reservacion

  @Property()
  cantidadPersonas: number;//cantidad de personas para la reserva

  @Property()
  tipoEvento:string;//Es cumpleaños, paosada, familiar, etc

  @Property()
  zonaReserva: string;//¿La reserva es en interior o exterior?

  @Property()
  menuEspecial: boolean;//¿Quieren menú de la casa o especial?

  @Property()
  tipoMenu:string;//solo es válido sí el tipo de menu no es de la casa

  @Property()
  fechaHoraDeReservacion: Date;
}
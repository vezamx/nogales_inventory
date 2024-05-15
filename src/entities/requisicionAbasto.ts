import {
  Entity,
  Property,
} from '@mikro-orm/core';
import { BaseEntityData } from './base';

@Entity()
export class RequisicionAbasto extends BaseEntityData {
  @Property()
  nombreSolicitante: string;//quien solicita

  @Property()
  areaSolicitante: string;//Area que lo solicita

  @Property()
  fechaSolicitud: Date;//Fecha en que fue solicitado el abasto

  @Property()
  fechaEntrega: Date;//Fecha en que fue entregado el abasto

  @Property()
  cantidadSolicitada: number;//cuanto es pedido

  @Property()
  cantidadEntregada: number;//cuanro es solicitado

  @Property()
  unidadDeMedida:string;

  @Property()
  articulosEntregados: string;//Que es lo que se va a antregar

  @Property()
  requisicionElaboradaPor: string;//id de quien la elabora (opcional)

  @Property()
  autorizadaPor: string;//id de quien autoriza (opcional)

  @Property()
  recibidoPor: string;//id de quien recibe el abasto
}
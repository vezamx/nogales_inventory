import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { BaseEntityData } from './base';
import { Productos } from './productos.entity';
import { User } from './user.entity';
import { SimpleBaseData } from './simplifiedBase';

enum EStatusComanda {
  ABIERTA = 'abierta',
  TERMINADA_PAGADA = 'terminada_pagada',
  TERMINADA_PENDIENTE_PAGO = 'terminada_pendiente_pago',
  TERMINADA_CANCELADA = 'terminada_cancelada',
}

export type TStatusComanda = `${EStatusComanda}`;

@Entity()
export class Comanda extends BaseEntityData {
  @Property()
  comensales: number;

  @ManyToMany(() => Productos)
  productos = new Collection<Productos>(this);

  @Enum({ items: () => EStatusComanda, default: EStatusComanda.ABIERTA })
  status: TStatusComanda;

  @ManyToOne(() => User)
  createdBy: User;

  @ManyToOne(() => User)
  updatedBy: User;
}

@Entity()
export class Comanda_Tickets extends SimpleBaseData {
  @OneToOne(() => Comanda)
  comanda: Comanda;

  @Property()
  subtotal: number;

  @OneToOne(() => Comanta_Tickets_Descuento, { nullable: true })
  descuento?: Comanta_Tickets_Descuento;

  @Property()
  total: number;
}

@Entity()
export class Comanta_Tickets_Descuento extends SimpleBaseData {
  @OneToOne(() => Comanda_Tickets)
  comanda_ticket: Comanda_Tickets;

  @Property()
  descuento: number;

  @Property({ default: false })
  isPercent: boolean;

  @Property()
  motivo: string;

  @OneToOne(() => User)
  approbedBy: User;
}

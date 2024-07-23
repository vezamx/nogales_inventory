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
import { Mesa } from './mesa.entity';

export enum EStatusComanda {
  ABIERTA = 'abierta',
  CANCELADA = 'cancelada',
  CANCELADA_UNIDA = 'cancelada_unida',
  TERMINADA_PAGADA = 'terminada_pagada',
  TERMINADA_PENDIENTE_PAGO = 'terminada_pendiente_pago',
  TERMINADA_CANCELADA = 'terminada_cancelada',
}

export type TStatusComanda = `${EStatusComanda}`;

@Entity()
export class Comanda_Descuento extends SimpleBaseData {
  @Property()
  descuento: number;

  @Property({ default: false })
  isPercent: boolean;

  @Property()
  motivo: string;

  @OneToOne(() => User)
  approbedBy: User;
}

@Entity()
export class Comanda extends BaseEntityData {
  @Property()
  comensales: number;

  @ManyToMany(() => Productos)
  productos = new Collection<Productos>(this);

  @Enum({ items: () => EStatusComanda, default: EStatusComanda.ABIERTA })
  status: TStatusComanda;

  @OneToOne({ entity: () => Mesa, owner: true })
  mesa: Mesa;

  @ManyToMany({ entity: () => Comanda, nullable: true })
  comandasAdjuntas? = new Collection<Comanda>(this);

  @OneToOne(() => Comanda_Descuento, { nullable: true })
  descuento?: Comanda_Descuento;

  @ManyToOne(() => User)
  createdBy: User;

  @ManyToOne(() => User)
  updatedBy: User;
}

@Entity()
export class Comanda_Tickets extends BaseEntityData {
  @OneToOne(() => Comanda)
  comanda: Comanda;

  @Property()
  subtotal: number;

  @Property({ nullable: true })
  descuentos?: number;

  @Property()
  total: number;
}

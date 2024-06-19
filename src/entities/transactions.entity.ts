import { Collection, Entity, Enum, ManyToMany } from '@mikro-orm/core';
import { BaseEntityData } from './base';

enum ETipoTransaccion {
  INGRESO = 'INGRESO',
  EGRESO = 'EGRESO',
  AJUSTE = 'AJUSTE',
}
export type TTipoTransaccion = `${ETipoTransaccion}`;
@Entity()
export class Transactions extends BaseEntityData {
  @Enum({ items: () => ETipoTransaccion, default: ETipoTransaccion.AJUSTE })
  tipoTransaccion: TTipoTransaccion;

  @ManyToMany(() => Transactions)
  productosAfectados = new Collection<Transactions>(this);
}

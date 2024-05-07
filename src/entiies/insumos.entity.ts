import { Enum, Property, Unique } from '@mikro-orm/core';
import { BaseEntityData } from './base';

export enum EUnidadInsumo {
  'kg' = 'kg',
  'lt' = 'lt',
  'pz' = 'pz',
}

export type TUnidadInsumo = keyof typeof EUnidadInsumo;

export class Insumos extends BaseEntityData {
  @Property()
  @Unique()
  nombre!: string;

  @Property({ nullable: true })
  descripcion!: string;

  @Enum({ items: () => EUnidadInsumo, default: EUnidadInsumo.kg })
  unidad!: TUnidadInsumo;

  @Property()
  cantidad!: number;
}

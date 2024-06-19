import { ArrayType, Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntityData } from './base';
import {
  EPermissionAction,
  EPermissionContext,
  TPermissionAction,
} from '../utils/types';
import { User } from './user.entity';

@Entity()
export class Transactions extends BaseEntityData {
  @Enum({ items: () => EPermissionAction })
  tipoTransaccion: TPermissionAction;

  @Property({ type: ArrayType })
  elementosAfectados: string[];

  @Enum({ items: () => EPermissionContext })
  contexto: `${EPermissionContext}`;

  @ManyToOne(() => User)
  createdBy: User;
}

import { Entity, Enum, Property, SerializedPrimaryKey } from '@mikro-orm/core';
import { BaseEntityData } from './base';

export enum ERole {
  ADMIN = 'admin',
  USER = 'user',
}

export type TRole = keyof typeof ERole;
@Entity()
export class User extends BaseEntityData {
  @Property()
  name: string;

  @SerializedPrimaryKey({ autoincrement: true, primary: false })
  noEmpleado: number;

  @Enum({ items: () => ERole, default: ERole.USER })
  role: TRole;

  @Property()
  email: string;

  @Property()
  llaveEmpleado: string;
}

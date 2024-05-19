import { Entity, Enum, Property, SerializedPrimaryKey } from '@mikro-orm/core';
import { BaseEntityData } from './base';

export enum ERole {
  ADMIN = 'admin',
  USER = 'user',
}

export type TRole = `${ERole}`;
@Entity()
export class User extends BaseEntityData {
  @Property()
  name: string;

  @SerializedPrimaryKey({ autoincrement: true, primary: false })
  noEmpleado: number;

  @Enum({ items: () => ERole, default: ERole.USER })
  role: TRole = ERole.USER;

  @Property()
  email: string;
}

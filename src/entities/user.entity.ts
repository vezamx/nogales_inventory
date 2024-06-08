import {
  Entity,
  ManyToOne,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { BaseEntityData } from './base';
import { Roles } from './roles.entity';

@Entity()
export class User extends BaseEntityData {
  @Property()
  name: string;

  @SerializedPrimaryKey({ autoincrement: true, primary: false })
  noEmpleado: number;

  @ManyToOne(() => Roles)
  role: Roles;

  @Property()
  email: string;
}

import { Entity, Property, SerializedPrimaryKey } from '@mikro-orm/core';
import { BaseEntityData } from './base';

@Entity()
export class User extends BaseEntityData {
  @Property()
  name: string;

  @SerializedPrimaryKey({ autoincrement: true, primary: false })
  noEmpleado: number;

  @Property()
  email: string;

  @Property()
  llaveEmpleado: string;
}

import { Property, Entity } from '@mikro-orm/core';
import { BaseEntityData } from './base';

@Entity()
export class Seccion extends BaseEntityData {
  @Property()
  nombre: string;
}

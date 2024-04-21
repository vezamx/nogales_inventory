import { Entity, Property } from '@mikro-orm/core';
import { BaseEntityData } from './base';

@Entity()
export class User extends BaseEntityData {
  @Property()
  name: string;
}

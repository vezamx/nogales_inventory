import { Entity, Property } from '@mikro-orm/core';
import { TPermission } from '../utils/types';
import { BaseEntityData } from './base';

@Entity()
export class Roles extends BaseEntityData {
  @Property({ type: 'text', nullable: false })
  name!: string;

  @Property({ type: 'array', nullable: false })
  permissions: TPermission[] = [];
}

import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntityData } from './base';
import { User } from './user.entity';

@Entity()
export class Transactions extends BaseEntityData {
  @Property()
  method: string;

  @Property()
  url: string;

  @Property()
  body: string;

  @ManyToOne(() => User, { nullable: true })
  createdBy?: User;
}

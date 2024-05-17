import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { BaseEntityData } from './base';
import { User } from './user.entity';
@Entity()
export class Productos extends BaseEntityData {
  @Property()
  @Unique()
  nombre: string;

  @Property({ nullable: true })
  descripcion: string;

  @Property()
  photo_path: string;

  @Property()
  video_path: string;

  @Property()
  costo: number;

  @ManyToOne()
  updatedBy: User;

  @ManyToOne()
  createdBy: User;
}

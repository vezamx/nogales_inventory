import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { BaseEntityData } from './base';
import { User } from './user.entity';
import { Insumos } from './insumos.entity';
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

  @ManyToMany({ entity: () => Insumos, cascade: [Cascade.ALL] })
  insumos = new Collection<Insumos>(this);

  @ManyToOne()
  updatedBy: User;

  @ManyToOne()
  createdBy: User;
}

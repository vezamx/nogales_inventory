import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { BaseEntityData } from './base';
import { Insumos } from './insumos.entity';
import { User } from './user.entity';
import { SimpleBaseData } from './simplifiedBase';
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

  @ManyToMany({
    entity: () => Productos_Ingredientes,
    owner: true,
    cascade: [Cascade.ALL],
  })
  insumos = new Collection<Productos_Ingredientes>(this);

  @ManyToOne()
  updatedBy: User;

  @ManyToOne()
  createdBy: User;
}

@Entity()
export class Productos_Ingredientes extends SimpleBaseData {
  @OneToOne(() => Insumos)
  insumo: Insumos;

  @Property()
  cantidad: number;
}

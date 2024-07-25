import { OneToOne, Property, Entity } from '@mikro-orm/core';

import { BaseEntityData } from './base';
import { Seccion } from './seccion.entity';

@Entity()
export class Mesa extends BaseEntityData {
  @Property()
  nombre: string;

  @OneToOne({ entity: () => Seccion, owner: true })
  seccion: Seccion;
}

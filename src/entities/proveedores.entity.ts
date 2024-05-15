import { Entity, Property } from '@mikro-orm/core';
import { BaseEntityData } from './base';

@Entity()
export class Proveedores extends BaseEntityData {
  @Property()
  razonSocial: string;

  @Property()
  email: string;

  @Property()
  encargado: string;

  @Property()
  direccion: string;

  @Property()
  estado: string;//estado de la republica del proveedor

  @Property()
  municipio: string;

  @Property()
  telefono: string;

  @Property()
  pais: string;//no se si sea requerido o no

  @Property()
  productosProveedor: string;//que es lo que vende
}

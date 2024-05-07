import { EntityManager } from '@mikro-orm/mongodb';
import { Injectable } from '@nestjs/common';
import { Insumos } from 'src/entiies/insumos.entity';

@Injectable()
export class InsumosService {
  constructor(private readonly em: EntityManager) {}
  async find() {
    return await this.em.find(Insumos, {});
  }

  async findOne(id: string) {
    return await this.em.findOne(Insumos, { id });
  }
}

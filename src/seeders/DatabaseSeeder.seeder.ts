import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Roles } from '../entities/roles.entity';
import { User } from '../entities/user.entity';
import { EPermissionContext } from '../utils/types';

export class DatabaseSeeder extends Seeder {
  //@ts-ignore
  async run(em: EntityManager): Promise<void> {
    const array = Object.values(EPermissionContext).map((name) => ({
      context: name,
      action: 'all',
    }));

    const role = em.create(Roles, {
      name: 'admin',
      permissions: array,
    });

    //@ts-ignore
    const user = em.create(User, {
      name: 'admin',
      email: 'test@test.com',
      role,
    });
  }
}

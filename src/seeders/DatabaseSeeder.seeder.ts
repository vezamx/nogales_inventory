import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Roles } from '../entities/roles.entity';
import { User } from '../entities/user.entity';
import { EPermissionContext } from '../utils/types';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const array = Object.values(EPermissionContext).map((name) => ({
      context: name,
      action: 'all',
    }));

    const SystemRole = em.create(Roles, {
      name: 'system',
      permissions: [
        {
          context: 'productos',
          action: 'read',
        },
        {
          context: 'comandas',
          action: 'read',
        },
      ],
    });

    const SystemUser = em.create(User, {
      name: 'system',
      email: 'system@system.com',
      role: SystemRole,
    });

    const role = em.create(Roles, {
      name: 'admin',
      permissions: array,
    });

    const user = em.create(User, {
      name: 'admin',
      email: 'test@test.com',
      role,
    });

    em.persist([role, user, SystemRole, SystemUser]);
  }
}

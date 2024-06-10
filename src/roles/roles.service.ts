import { EntityManager } from '@mikro-orm/mongodb';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Roles } from '../entities/roles.entity';
import { User } from '../entities/user.entity';
import { ERROR_MESSAGES } from '../utils/constants';
import { TPermission } from '../utils/types';
import { RolesCreateDto } from './dto/rolesCreate.dto';
import * as _ from 'lodash';

@Injectable()
export class RolesService {
  constructor(private readonly em: EntityManager) {}

  logger = new Logger(RolesService.name);
  async find() {
    return this.em.find(Roles, {});
  }
  async findOne(id: string) {
    const user = await this.em.findOne(Roles, { id });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    return user;
  }

  async create(data: RolesCreateDto) {
    try {
      const role = this.em.create(Roles, data);

      await this.em.persistAndFlush(role);
      return role;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async delete(id: string) {
    const role = await this.em.findOne(Roles, { id });
    if (!role) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    await this.em.removeAndFlush(role);
    return role;
  }

  async assign(userId: string, roleId: string) {
    const user = await this.em.findOne(User, { id: userId });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    const role = await this.em.findOne(Roles, { id: roleId });

    if (!role) {
      throw new BadRequestException(ERROR_MESSAGES.BAD_REQUEST);
    }

    user.role = role;

    await this.em.persistAndFlush(user);
    return user;
  }

  async addPermissionToRole(roleId: string, permissions: TPermission[]) {
    const role = await this.em.findOne(Roles, { id: roleId });

    if (!role) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    const auxPermissions = [...role.permissions, ...permissions];

    const uniquePermissions = _.uniqWith(auxPermissions, _.isEqual);

    role.permissions = uniquePermissions;

    //Check if any of the permissions is action="all" and remove all the other permissions that have the proerty context equal to the context

    const allPermissions = uniquePermissions.filter(
      (permission) => permission.action === 'all',
    );

    if (allPermissions.length > 0) {
      const context = allPermissions[0].context;
      role.permissions = role.permissions.filter(
        (permission) =>
          permission.context !== context || permission.action === 'all',
      );
    }

    await this.em.persistAndFlush(role);

    return role;
  }

  async removePermissionFromRole(roleId: string, permissions: TPermission[]) {
    const role = await this.em.findOne(Roles, { id: roleId });

    if (!role) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    role.permissions = role.permissions.filter(
      (permission) => !permissions.some((p) => _.isEqual(p, permission)),
    );

    await this.em.persistAndFlush(role);

    return role;
  }

  async removeRoleFromUser(userId: string) {
    const user = await this.em.findOne(User, { id: userId });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    user.role = null;

    await this.em.persistAndFlush(user);

    return user;
  }
}

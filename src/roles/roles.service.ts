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

    const uniquePermissions = permissions.filter((permission) => {
      if (!role.permissions.includes(permission)) {
        role.permissions.push(permission);
      }
    });

    role.permissions = [...role.permissions, ...uniquePermissions];

    await this.em.persistAndFlush(role);

    return role;
  }

  async removePermissionFromRole(roleId: string, permissions: TPermission[]) {
    const role = await this.em.findOne(Roles, { id: roleId });

    if (!role) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    role.permissions = role.permissions.filter(
      (permission) => !permissions.includes(permission),
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

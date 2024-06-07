import { EntityManager } from '@mikro-orm/mongodb';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserCreateDto } from './dto/user_create.dto';
import { Roles } from '../entities/roles.entity';
import { ERROR_MESSAGES } from '../utils/constants';

@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}

  async find() {
    return await this.em.fork().find(User, {});
  }
  async findOne(id: string) {
    return await this.em.fork().findOne(User, { id });
  }

  async create(userData: UserCreateDto) {
    try {
      const role = await this.em.fork().findOne(Roles, { name: userData.role });

      if (!role) {
        throw new InternalServerErrorException(ERROR_MESSAGES.BAD_REQUEST);
      }

      const user = this.em.create(User, { ...userData, role });

      await this.em.persistAndFlush(user);
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

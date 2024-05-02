import { EntityManager } from '@mikro-orm/mongodb';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/entiies/user.entity';
import { UserCreateDto } from './dto/user_create.dto';
import { generarLlaveEmpleado } from './helpers/userinformation';

@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}

  async find() {
    return await this.em.find(User, {});
  }
  async findOne(id: string) {
    return await this.em.findOne(User, { id });
  }

  async create(userData: UserCreateDto) {
    try {
      const user = this.em.create(User, userData);
      user.llaveEmpleado = await generarLlaveEmpleado(
        user.name,
        user.noEmpleado,
      );

      await this.em.persistAndFlush(user);
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

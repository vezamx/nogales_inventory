import { EntityManager } from '@mikro-orm/mongodb';
import { BadRequestException, Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { User } from 'src/entities/user.entity';
import { ERROR_MESSAGES } from 'src/utils/constants';
require('dotenv').config();

@Injectable()
export class AuthService {
  constructor(private readonly em: EntityManager) {}

  async generateToken(idEmpleado: string) {
    const user = await this.em.fork().findOne(User, { id: idEmpleado });

    if (!user) {
      throw new BadRequestException(ERROR_MESSAGES.BAD_REQUEST);
    }

    const token = sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '365d',
      },
    );
    return {
      token,
    };
  }
}

import { EntityManager } from '@mikro-orm/mongodb';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Transactions } from '../entities/transactions.entity';
import { TransactionsCreateDto } from './dto/transactionsCreate.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class TransactionsService {
  constructor(private readonly em: EntityManager) {}

  private logger = new Logger('TransactionsService');
  async find() {
    return this.em.find(Transactions, {});
  }

  async findOne(id: string) {
    const transaction = await this.em.findOne(Transactions, { id });
    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return transaction;
  }

  async create(data: TransactionsCreateDto, userId: string) {
    try {
      const user = await this.em.findOne(User, {
        id: userId,
      });

      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }

      const transaction = this.em.create(Transactions, data);

      transaction.createdBy = user;
      await this.em.persistAndFlush(transaction);
      return transaction;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}

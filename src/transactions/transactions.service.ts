import { EntityManager } from '@mikro-orm/mongodb';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Transactions } from 'src/entities/transactions.entity';
import { TransactionsCreateDto } from './dto/transactionsCreate.dto';

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

  async create(data: TransactionsCreateDto) {
    try {
      const transaction = this.em.create(Transactions, data);
      await this.em.persistAndFlush(transaction);
      return transaction;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}

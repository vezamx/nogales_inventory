import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { EntityManager, defineConfig } from '@mikro-orm/mongodb';
import { MikroORM } from '@mikro-orm/core';
import { Transactions } from '../entities/transactions.entity';
import { TransactionsCreateDto } from './dto/transactionsCreate.dto';
import { User } from '../entities/user.entity';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let orm: MikroORM;
  let em: EntityManager;

  beforeAll(async () => {
    const config = defineConfig({
      dbName: 'test',
      entities: ['dist/**/*.entity.js'],
      entitiesTs: ['src/**/*.entity.ts'],
      clientUrl: 'mongodb://localhost:27017',
      connect: false,
      allowGlobalContext: true,
    });

    orm = await MikroORM.init(config);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: EntityManager,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            persistAndFlush: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    em = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should return an array of transactions', async () => {
      const result = [
        orm.em.create(Transactions, {
          method: 'GET',
          url: '/transactions',
          body: JSON.stringify({}),
          createdBy: '60e6e1f1f4f9b5c6b0f1f1c6',
        }),
      ];
      jest.spyOn(em, 'find').mockResolvedValue(result);
      expect(await service.find()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a transaction', async () => {
      const result = orm.em.create(Transactions, {
        method: 'GET',
        url: '/transactions',
        body: JSON.stringify({}),
        createdBy: '60e6e1f1f4f9b5c6b0f1f1c6',
      });
      jest.spyOn(em, 'findOne').mockResolvedValue(result);
      expect(await service.findOne('1')).toBe(result);
    });

    it("Should return NotFoundException if transaction doesn't exist", async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const transaction: TransactionsCreateDto = {
        method: 'GET',
        url: '/transactions',
        body: JSON.stringify({}),
      };

      const user = orm.em.create(User, {
        name: 'John Doe',
        email: 'test@test.com',
        role: null,
      });

      jest.spyOn(em, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(em, 'create').mockReturnValue(transaction);
      expect(await service.create(transaction, '1')).toBe(transaction);
      expect(em.persistAndFlush).toHaveBeenCalled();
    });

    it("Should throe NotFoundException if user doesn't exist", async () => {
      const transaction: TransactionsCreateDto = {
        method: 'GET',
        url: '/transactions',
        body: JSON.stringify({}),
      };
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(service.create(transaction, '1')).rejects.toThrowError();
    });
  });
});

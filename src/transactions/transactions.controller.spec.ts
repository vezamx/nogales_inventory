import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { RolesService } from '../roles/roles.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        { provide: RolesService, useValue: {} },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should return an array of transactions', async () => {
      const result = [];
      jest.spyOn(service, 'find').mockResolvedValue(result);
      expect(await controller.find()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a transaction', async () => {
      const result = {
        id: '1',
        amount: 100,
        description: 'test',
        date: new Date(),
        type: 'income',
        category: 'test',
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);
      expect(await controller.findOne('1')).toBe(result);
    });
  });
});

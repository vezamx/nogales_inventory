import { Test, TestingModule } from '@nestjs/testing';
import { ComandasController } from './comandas.controller';
import { ComandasService } from './comandas.service';
import { RolesService } from '../roles/roles.service';
import { TransactionsService } from '../transactions/transactions.service';

describe('ComandasController', () => {
  let controller: ComandasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComandasController],
      providers: [
        { provide: ComandasService, useValue: {} },
        { provide: RolesService, useValue: {} },
        { provide: TransactionsService, useValue: {} },
      ],
    }).compile();

    controller = module.get<ComandasController>(ComandasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

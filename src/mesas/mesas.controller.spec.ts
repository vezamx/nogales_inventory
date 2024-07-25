import { Test, TestingModule } from '@nestjs/testing';
import { MesasController } from './mesas.controller';
import { RolesService } from '../roles/roles.service';
import { TransactionsService } from '../transactions/transactions.service';
import { MesasService } from './mesas.service';

describe('MesasController', () => {
  let controller: MesasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MesasController],
      providers: [
        {
          provide: RolesService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: TransactionsService,
          useValue: {},
        },
        {
          provide: MesasService,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MesasController>(MesasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

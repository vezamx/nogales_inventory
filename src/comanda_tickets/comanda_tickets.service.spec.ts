import { Test, TestingModule } from '@nestjs/testing';
import { ComandaTicketsService } from './comanda_tickets.service';
import { EntityManager } from '@mikro-orm/mongodb';
import { ProductosService } from '../productos/productos.service';

describe('ComandaTicketsService', () => {
  let service: ComandaTicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComandaTicketsService,
        {
          provide: EntityManager,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            persistAndFlush: jest.fn(),
          },
        },
        {
          provide: ProductosService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ComandaTicketsService>(ComandaTicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

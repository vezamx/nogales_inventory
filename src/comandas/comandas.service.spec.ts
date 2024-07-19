import { Test, TestingModule } from '@nestjs/testing';
import { ComandasService } from './comandas.service';
import { EntityManager } from '@mikro-orm/mongodb';
import { ComandaTicketsService } from '../comanda_tickets/comanda_tickets.service';

describe('ComandasService', () => {
  let service: ComandasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComandasService,
        { provide: EntityManager, useValue: {} },
        { provide: ComandaTicketsService, useValue: {} },
      ],
    }).compile();

    service = module.get<ComandasService>(ComandasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ComandaTicketsService } from './comanda_tickets.service';

describe('ComandaTicketsService', () => {
  let service: ComandaTicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComandaTicketsService],
    }).compile();

    service = module.get<ComandaTicketsService>(ComandaTicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

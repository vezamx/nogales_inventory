import { Test, TestingModule } from '@nestjs/testing';
import { MesasService } from './mesas.service';
import { defineConfig, EntityManager } from '@mikro-orm/mongodb';
import { MikroORM } from '@mikro-orm/core';
import { Mesa } from '../entities/mesa.entity';
import { NotFoundException } from '@nestjs/common';
import { mockedEm } from '../productos/__mocks__/em.mock';

describe('MesasService', () => {
  let service: MesasService;
  let orm: MikroORM;

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
        MesasService,
        {
          provide: EntityManager,
          useValue: {
            ...mockedEm,
            fork: jest.fn().mockReturnValue(mockedEm),
          },
        },
      ],
    }).compile();

    service = module.get<MesasService>(MesasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should return an array of mesas', async () => {
      const result: Mesa[] = [orm.em.create(Mesa, {})];
      jest.spyOn(service, 'find').mockResolvedValue(result);
      expect(await service.find()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a mesa', async () => {
      const result: Mesa = orm.em.create(Mesa, {});
      jest.spyOn(service, 'findOne').mockResolvedValue(result);
      expect(await service.findOne('1')).toBe(result);
    });
    it('should throw an error if mesa not found', async () => {
      try {
        jest.spyOn(service, 'findOne').mockResolvedValue(null);
        await service.findOne('1');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});

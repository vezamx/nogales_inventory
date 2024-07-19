import { Test, TestingModule } from '@nestjs/testing';
import { InsumosService } from './insumos.service';
import { EntityManager, ObjectId } from '@mikro-orm/mongodb';
import { Insumos } from '../entities/insumos.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('InsumosService', () => {
  let service: InsumosService;
  let em: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InsumosService,
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

    service = module.get<InsumosService>(InsumosService);
    em = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should return an array of insumos', async () => {
      const insumos: Array<Partial<Insumos>> = [
        { id: '1', nombre: 'Insumo 1', cantidad: 10, unidad: 'kg' },
      ];
      jest.spyOn(em, 'find').mockResolvedValue(insumos);
      expect(await service.find()).toBe(insumos);
    });
  });
  describe('findOne', () => {
    it('should return an insumo', async () => {
      const insumo: Partial<Insumos> = {
        id: '1',
        nombre: 'Insumo 1',
        cantidad: 10,
        unidad: 'kg',
      };
      jest.spyOn(em, 'findOne').mockResolvedValue(insumo);
      expect(await service.findOne('1')).toBe(insumo);
    });
    it('should return error if insumo not found', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });
  describe('create', () => {
    it('should create an insumo', async () => {
      const insumo: Insumos = {
        nombre: 'Insumo 1',
        cantidad: 10,
        descripcion: 'Insumo 1',
        unidad: 'kg',
        _id: ObjectId.createFromTime(1),
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(em, 'create').mockReturnValue(insumo);
      expect(await service.create(insumo)).toBe(insumo);
      expect(em.persistAndFlush).toHaveBeenCalledWith(insumo);
    });
    it('should return error if insumo not created', async () => {
      jest.spyOn(em, 'create').mockImplementation(() => {
        throw new Error();
      });
      await expect(service.create({} as Insumos)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
  describe('update', () => {
    it('should update an insumo', async () => {
      const insumo: Partial<Insumos> = {
        id: '1',
        nombre: 'Insumo 1',
        cantidad: 10,
        unidad: 'kg',
      };
      jest.spyOn(em, 'findOne').mockResolvedValue(insumo);
      expect(
        await service.update('1', { operacion: 'add', cantidad: 10 }),
      ).toBe(insumo);
      expect(em.persistAndFlush).toHaveBeenCalledWith(insumo);
    });
    it('should return error if insumo not found', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(
        service.update('1', { operacion: 'add', cantidad: 10 }),
      ).rejects.toThrow(NotFoundException);
    });
    it('Should add quantity to insumo', async () => {
      const insumo: Partial<Insumos> = {
        id: '1',
        nombre: 'Insumo 1',
        cantidad: 10,
        unidad: 'kg',
      };
      jest.spyOn(em, 'findOne').mockResolvedValue(insumo);
      expect(
        await service.update('1', { operacion: 'add', cantidad: 10 }),
      ).toBe(insumo);
      expect(insumo.cantidad).toBe(20);
    });
    it('Should subtract quantity to insumo', async () => {
      const insumo: Partial<Insumos> = {
        id: '1',
        nombre: 'Insumo 1',
        cantidad: 10,
        unidad: 'kg',
      };
      jest.spyOn(em, 'findOne').mockResolvedValue(insumo);
      expect(
        await service.update('1', { operacion: 'substract', cantidad: 5 }),
      ).toBe(insumo);
      expect(insumo.cantidad).toBe(5);
    });
    it('Should set quantity to insumo', async () => {
      const insumo: Partial<Insumos> = {
        id: '1',
        nombre: 'Insumo 1',
        cantidad: 10,
        unidad: 'kg',
      };
      jest.spyOn(em, 'findOne').mockResolvedValue(insumo);
      expect(await service.update('1', { operacion: 'set', cantidad: 5 })).toBe(
        insumo,
      );
      expect(insumo.cantidad).toBe(5);
    });
    it('should return error if insumo not updated', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue({});
      jest.spyOn(em, 'persistAndFlush').mockImplementation(() => {
        throw new Error();
      });
      await expect(
        service.update('1', { operacion: 'add', cantidad: 10 }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});

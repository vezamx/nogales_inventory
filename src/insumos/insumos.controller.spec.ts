import { Test, TestingModule } from '@nestjs/testing';
import { InsumosController } from './insumos.controller';
import { InsumosService } from './insumos.service';
import { Insumos } from 'src/entities/insumos.entity';
import { ObjectId } from '@mikro-orm/mongodb';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InsumoUpdateDto } from './dto/insumoUpdate.dto';
import { RolesService } from '../roles/roles.service';
import { TransactionsService } from '../transactions/transactions.service';

describe('InsumosController', () => {
  let controller: InsumosController;
  let service: InsumosService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsumosController],
      providers: [
        {
          provide: InsumosService,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            dropProductInsumos: jest.fn(),
          },
        },
        {
          provide: RolesService,
          useValue: {},
        },
        {
          provide: TransactionsService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<InsumosController>(InsumosController);
    service = module.get<InsumosService>(InsumosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it("should return an empty array if there aren't insumos", async () => {
      jest.spyOn(service, 'find').mockResolvedValue([]);
      expect(await controller.find()).toEqual([]);
    });

    it('should return an array of insumos', async () => {
      const insumos: Partial<Insumos[]> = [
        {
          id: '1',
          nombre: 'Insumo 1',
          cantidad: 10,
          unidad: 'kg',
          _id: ObjectId.createFromTime(1),
          createdAt: new Date(),
          updatedAt: new Date(),
          descripcion: 'Insumo 1',
        },
      ];
      jest.spyOn(service, 'find').mockResolvedValue(insumos);
      expect(await controller.find()).toBe(insumos);
    });
  });

  describe('findOne', () => {
    it('should return an insumo', async () => {
      const insumo: Insumos = {
        id: '1',
        nombre: 'Insumo 1',
        cantidad: 10,
        unidad: 'kg',
        _id: ObjectId.createFromTime(1),
        createdAt: new Date(),
        updatedAt: new Date(),
        descripcion: 'Insumo 1',
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(insumo);
      expect(await controller.findOne('1')).toBe(insumo);
    });
    it("Should throw a NotFoundException if the insumo doesn't exist", async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });
  describe('create', () => {
    it('should create an insumo', async () => {
      const insumo: Insumos = {
        nombre: 'Insumo 1',
        cantidad: 10,
        unidad: 'kg',
        descripcion: 'Insumo 1',
        _id: ObjectId.createFromTime(1),
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(service, 'create').mockResolvedValue(insumo);
      expect(await controller.create(insumo)).toBe(insumo);
    });
    it('should throw an error if the insumo could not be created', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new InternalServerErrorException());
      await expect(controller.create({} as Insumos)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update an insumo', async () => {
      const insumo: Insumos = {
        nombre: 'Insumo 1',
        cantidad: 10,
        unidad: 'kg',
        descripcion: 'Insumo 1',
        _id: ObjectId.createFromTime(1),
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const InsumoUpdateData: InsumoUpdateDto = {
        operacion: 'add',
        cantidad: 10,
      };
      jest.spyOn(service, 'update').mockResolvedValue(insumo);
      expect(await controller.update('1', InsumoUpdateData)).toBe(insumo);
    });
    it('should throw an error if the insumo could not be updated', async () => {
      const InsumoUpdateData: InsumoUpdateDto = {
        operacion: 'add',
        cantidad: 10,
      };

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new InternalServerErrorException());
      await expect(controller.update('1', InsumoUpdateData)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});

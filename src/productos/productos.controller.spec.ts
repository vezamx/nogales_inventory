import { MikroORM, defineConfig } from '@mikro-orm/mongodb';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomRequest } from 'src/utils/types';
import { Productos } from '../entities/productos.entity';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { RolesService } from '../roles/roles.service';
import { TransactionsService } from '../transactions/transactions.service';

describe('ProductosController', () => {
  let controller: ProductosController;
  let service: ProductosService;
  let orm: MikroORM;

  beforeAll(async () => {
    const config = defineConfig({
      dbName: 'test',
      entities: ['dist/**/*.entity.js'],
      entitiesTs: ['src/**/*.entity.ts'],
      connect: false,
      allowGlobalContext: true,
    });

    orm = await MikroORM.init(config);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductosController],
      providers: [
        {
          provide: ProductosService,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: RolesService,
          useValue: {
            findOne: jest.fn(),
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

    controller = module.get<ProductosController>(ProductosController);
    service = module.get<ProductosService>(ProductosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should return an array of products', async () => {
      const result = [
        orm.em.fork().create(Productos, {
          nombre: 'test',
          costo: 10,
          photo_path: 'test',
          video_path: 'test',
        }),
      ];
      jest.spyOn(service, 'find').mockResolvedValue(result);

      expect(await controller.find()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      const result = orm.em.fork().create(Productos, {
        nombre: 'test',
        costo: 10,
        photo_path: 'test',
        video_path: 'test',
      });
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
    });
    it('should throw an error if the product does not exist', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a product', async () => {
      const result = orm.em.fork().create(Productos, {
        nombre: 'test',
        costo: 10,
        photo_path: 'test',
        video_path: 'test',
      });
      jest.spyOn(service, 'create').mockResolvedValue(result);
      const req: CustomRequest = {
        user: '1',
      } as CustomRequest;

      expect(
        await controller.create(
          {
            nombre: 'test',
            costo: 10,
            photo_path: 'test',
            video_path: 'test',
            descripcion: 'test',
            insumos: [{ id: '1', cantidad: 1 }],
          },
          req,
        ),
      ).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updatedResult = orm.em.fork().create(Productos, {
        nombre: 'test2',
        costo: 10,
        photo_path: 'test',
        video_path: 'test',
        descripcion: 'test',
      });

      jest.spyOn(service, 'update').mockResolvedValue(updatedResult);
      const req: CustomRequest = {
        user: '1',
      } as CustomRequest;

      expect(
        await controller.update(
          '1',
          {
            nombre: 'test2',
          },
          req,
        ),
      ).toBe(updatedResult);
    });
  });
});

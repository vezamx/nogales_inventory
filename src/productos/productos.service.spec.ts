import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { EntityManager, MikroORM, defineConfig } from '@mikro-orm/mongodb';
import { Productos } from '../entities/productos.entity';
import { InsumosService } from '../insumos/insumos.service';
import { mockedEm } from './__mocks__/em.mock';
import { User } from '../entities/user.entity';
import { ERROR_MESSAGES } from '../utils/constants';
import { ProductoUpdateDto } from './dto/producto.update';
import { Roles } from '../entities/roles.entity';
import { RolesService } from '../roles/roles.service';
import { TransactionsService } from '../transactions/transactions.service';

describe('ProductosService', () => {
  let service: ProductosService;
  let em: EntityManager;
  let orm: MikroORM;
  let mockedProd: Productos;

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

    mockedProd = orm.em.fork().create(Productos, {
      nombre: 'test',
      costo: 10,
      photo_path: 'test',
      video_path: 'test',
    });

    orm.em.persist(mockedProd);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        {
          provide: EntityManager,
          useValue: {
            ...mockedEm,
            fork: jest.fn(() => mockedEm),
          },
        },
        { provide: InsumosService, useValue: {} },
        { provide: RolesService, useValue: {} },
        { provide: TransactionsService, useValue: {} },
      ],
    }).compile();

    em = module.get<EntityManager>(EntityManager);
    service = module.get<ProductosService>(ProductosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('find', () => {
    it('should return an array of products', async () => {
      const resultProd = [
        em.create(Productos, {
          nombre: 'test',
          costo: 10,
          photo_path: 'test',
          video_path: 'test',
        }),
      ];
      jest.spyOn(em, 'find').mockResolvedValue(resultProd);

      expect(await service.find()).toBe(resultProd);
    });
  });
  describe('findOne', () => {
    it('should return a product', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(mockedProd);

      expect(await service.findOne('1')).toBe(mockedProd);
    });
    it('Should thror an error if the product does not exist', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      try {
        await service.findOne('1');
      } catch (e) {
        expect(e.message).toBe(ERROR_MESSAGES.BAD_REQUEST);
      }
    });
  });

  describe('create', () => {
    it('should create a product', async () => {
      const result = orm.em.create(Productos, {
        nombre: 'test',
        costo: 10,
        photo_path: 'test',
        video_path: 'test',
      });

      const adminRole = orm.em.create(Roles, {
        name: 'admin',
        permissions: [],
      });

      const admin = orm.em.create(User, {
        email: 'test',
        role: adminRole,
      });

      const productoData = {
        nombre: 'test',
        costo: 10,
        photo_path: 'test',
        video_path: 'test',
        descripcion: 'test',
        insumos: [{ id: '1', cantidad: 10 }],
      };
      jest.spyOn(em, 'create').mockReturnValue(result);
      jest.spyOn(em, 'findOne').mockResolvedValue(admin);
      expect(await service.create(productoData, '1')).toBe(result);
    });
    it("Should throw an error if the user doesn't exist", async () => {
      const productoData = {
        nombre: 'test',
        costo: 10,
        photo_path: 'test',
        video_path: 'test',
        descripcion: 'test',
        insumos: [{ id: '1', cantidad: 10 }],
      };
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      try {
        await service.create(productoData, '1');
      } catch (e) {
        expect(e.message).toBe(ERROR_MESSAGES.BAD_REQUEST);
      }
    });
  });
  describe('update', () => {
    it('should update a product', async () => {
      const result = orm.em.create(Productos, {
        nombre: 'test',
        costo: 10,
        photo_path: 'test',
        video_path: 'test',
      });

      const productoData: ProductoUpdateDto = {
        nombre: 'test',
        costo: 10,
        photo_path: 'test',
        video_path: 'test',
        descripcion: 'test',
      };

      const userMock = orm.em.create(User, {
        email: 'test',
        name: 'admin',
        role: orm.em.create(Roles, {
          name: 'admin',
          permissions: [],
        }),
      });

      jest.spyOn(em, 'findOneOrFail').mockResolvedValueOnce(userMock);
      jest.spyOn(em, 'findOneOrFail').mockResolvedValueOnce(result);
      expect(await service.update('1', productoData, userMock.id)).toBe(result);
    });
    it('Should throw an error if the product does not exist', async () => {
      const productoData = {
        nombre: 'test',
        costo: 10,
        photo_path: 'test',
        video_path: 'test',
        descripcion: 'test',
        insumos: [{ id: '1', cantidad: 10 }],
      };
      jest.spyOn(em, 'findOneOrFail').mockRejectedValue(null);
      try {
        await service.update('1', productoData, '1');
      } catch (e) {
        expect(e.message).toBe(ERROR_MESSAGES.BAD_REQUEST);
      }
    });
  });
});

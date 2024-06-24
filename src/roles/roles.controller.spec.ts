import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { MikroORM, defineConfig } from '@mikro-orm/mongodb';
import { Roles } from '../entities/roles.entity';
import { TransactionsService } from '../transactions/transactions.service';

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;
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
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: TransactionsService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should return an array of roles', async () => {
      jest.spyOn(service, 'find').mockResolvedValueOnce([]);
      const roles = await controller.find();
      expect(roles).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a role', async () => {
      const roleMock = orm.em.create(Roles, {
        name: 'admin',
        permissions: [],
      });

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(roleMock);
      const role = await controller.findOne('1');
      expect(role).toEqual(roleMock);
    });
  });

  describe('create', () => {
    it('should create a role', async () => {
      const roleMock = orm.em.create(Roles, {
        name: 'admin',
        permissions: [],
      });
      jest.spyOn(service, 'create').mockResolvedValueOnce(roleMock);
      const role = await controller.create(roleMock);
      expect(role).toEqual(roleMock);
    });
  });

  describe('delete', () => {
    it('should delete a role', async () => {
      const roleMock = orm.em.create(Roles, {
        name: 'admin',
        permissions: [],
      });
      jest.spyOn(service, 'delete').mockResolvedValueOnce(roleMock);
      const role = await controller.delete('1');
      expect(role).toEqual(roleMock);
    });
  });
});

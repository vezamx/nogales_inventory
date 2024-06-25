import { MikroORM, defineConfig } from '@mikro-orm/mongodb';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Roles } from '../entities/roles.entity';
import { User } from '../entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RolesService } from '../roles/roles.service';
import { TransactionsService } from '../transactions/transactions.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
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
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
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
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should return an array of users', async () => {
      jest.spyOn(service, 'find').mockResolvedValueOnce([]);
      const users = await controller.find();
      expect(users).toEqual([]);
    });
  });
  describe('findOne', () => {
    it('should return a user', async () => {
      const userMock: User = orm.em.create(User, {
        name: 'test',
        email: 'test@test.com',
        role: orm.em.create(Roles, {
          name: 'user',
          permissions: [],
        }),
      });

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(userMock);
      const user = await controller.findOne('1');
      expect(user).toEqual(userMock);
    });
    it('should throw 404 error if user not found', async () => {
      try {
        jest.spyOn(service, 'findOne').mockResolvedValueOnce(undefined);
        await controller.findOne('1');
      } catch (error) {
        expect(error.message).toBe('User not found');
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
  describe('create', () => {
    it('should create a user', async () => {
      const userMock: User = orm.em.create(User, {
        name: 'test',
        email: 'test@test.com',
        role: orm.em.create(Roles, {
          name: 'admin',
          permissions: [],
        }),
      });

      jest.spyOn(service, 'create').mockResolvedValueOnce(userMock);
      const user = await controller.create({
        name: 'test',
        email: 'test@test.com',
        role: 'admin',
      });

      expect(user).toEqual(userMock);
    });
  });
});

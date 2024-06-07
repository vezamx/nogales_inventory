import { EntityManager, MikroORM, defineConfig } from '@mikro-orm/mongodb';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Roles } from '../entities/roles.entity';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';
import { mockedEm } from '../productos/__mocks__/em.mock';

describe('UsersService', () => {
  let service: UsersService;
  let entityManager: EntityManager;
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
      providers: [
        UsersService,
        {
          provide: EntityManager,
          useValue: {
            fork: jest.fn(() => mockedEm),
            ...mockedEm,
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should return an array of users', async () => {
      jest.spyOn(entityManager, 'find').mockResolvedValueOnce([]);
      const users = await service.find();
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
      jest.spyOn(entityManager, 'findOne').mockResolvedValueOnce(userMock);

      const user = await service.findOne('1');
      expect(user).toEqual(userMock);
    });
    it('should return undefined if user not found', async () => {
      jest.spyOn(entityManager, 'findOne').mockResolvedValueOnce(undefined);

      const user = await service.findOne('1');
      expect(user).toBeUndefined();
    });
  });
  describe('create', () => {
    it('should create a user', async () => {
      const roleMock = orm.em.create(Roles, {
        name: 'admin',
        permissions: [],
      });

      const userMock: User = orm.em.create(User, {
        name: 'test',
        email: 'test@test.com',
        role: roleMock,
      });

      jest.spyOn(entityManager, 'create').mockReturnValueOnce(userMock);
      jest.spyOn(entityManager, 'findOne').mockResolvedValueOnce(roleMock);
      const user = await service.create({
        name: 'test',
        email: 'test@test.com',
        role: 'admin',
      });
      expect(user).toEqual(userMock);
      expect(entityManager.persistAndFlush).toBeCalledTimes(1);
    });
    it('should throw an error if user creation fails', async () => {
      jest.spyOn(entityManager, 'create').mockImplementationOnce(() => {
        throw new Error('Error');
      });

      try {
        await service.create({
          name: 'test',
          email: 'test@test.com',
          role: 'admin',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
});

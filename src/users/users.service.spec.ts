import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { EntityManager, ObjectId } from '@mikro-orm/mongodb';
import { User } from '../entiies/user.entity';
import { InternalServerErrorException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: EntityManager,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            persistAndFlush: jest.fn(),
            create: jest.fn(),
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
      const userMock: User = {
        id: '1',
        name: 'test',
        email: 'test@test.com',
        llaveEmpleado: 'test',
        noEmpleado: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: ObjectId.createFromTime(1),
      };
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
      const userMock: User = {
        id: '1',
        name: 'test',
        email: 'test@test.com',
        llaveEmpleado: 'test',
        noEmpleado: 1,
        createdAt: new Date(),

        updatedAt: new Date(),
        _id: ObjectId.createFromTime(1),
      };
      jest.spyOn(entityManager, 'create').mockReturnValueOnce(userMock);

      const user = await service.create({
        name: 'test',
        email: 'test@test.com',
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
        });
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
});

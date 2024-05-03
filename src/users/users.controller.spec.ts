import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { EntityManager, ObjectId } from '@mikro-orm/mongodb';
import { UsersService } from './users.service';
import { User } from 'src/entiies/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

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

      jest.spyOn(service, 'create').mockResolvedValueOnce(userMock);
      const user = await controller.create({
        name: 'test',
        email: 'test@test.com',
      });

      expect(user).toEqual(userMock);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { EntityManager, MikroORM, defineConfig } from '@mikro-orm/mongodb';
import { User } from '../entities/user.entity';
import { verify } from 'jsonwebtoken';
import { mockedEm } from '../productos/__mocks__/em.mock';
import { BadRequestException } from '@nestjs/common';
import { Roles } from '../entities/roles.entity';
require('dotenv').config();

describe('AuthService', () => {
  let service: AuthService;
  let orm: MikroORM;
  let em: EntityManager;

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
        AuthService,
        {
          provide: EntityManager,
          useValue: {
            ...mockedEm,
            fork: jest.fn(() => mockedEm),
          },
        },
      ],
    }).compile();

    em = module.get<EntityManager>(EntityManager);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('Generate Token', () => {
    it('should return a token', async () => {
      const user = orm.em.create(User, {
        name: 'test',
        email: 'test@test.com',
        role: orm.em.create(Roles, {
          name: 'admin',
          permissions: [],
        }),
      });

      jest.spyOn(em, 'findOne').mockResolvedValue(user);

      const result = await service.generateToken('1');

      expect(verify(result.token, process.env.JWT_SECRET)).toBeTruthy();
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);

      await expect(service.generateToken('1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});

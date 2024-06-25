import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { EntityManager, defineConfig } from '@mikro-orm/mongodb';
import { MikroORM } from '@mikro-orm/core';
import { Roles } from '../entities/roles.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RolesCreateDto } from './dto/rolesCreate.dto';
import { User } from '../entities/user.entity';

describe('RolesService', () => {
  let service: RolesService;
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
        RolesService,
        {
          provide: EntityManager,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            persistAndFlush: jest.fn(),
            removeAndFlush: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    em = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should return an array of roles', async () => {
      const result = [];
      jest.spyOn(em, 'find').mockResolvedValue(result);
      expect(await service.find()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a role', async () => {
      const result = orm.em.create(Roles, {
        name: 'test',
        permissions: [],
      });

      jest.spyOn(em, 'findOne').mockResolvedValue(result);
      expect(await service.findOne('1')).toBe(result);
    });
    it('should throw an error if role not found', async () => {
      try {
        jest.spyOn(em, 'findOne').mockResolvedValue(null);
        await service.findOne('1');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create', () => {
    it('should create a role', async () => {
      const roleMock: Roles = orm.em.create(Roles, {
        name: 'admin',
        permissions: [],
      });
      const rolesCreateData: RolesCreateDto = {
        name: 'admin',
        permissions: [],
      };

      jest.spyOn(em, 'create').mockReturnValue(roleMock);

      expect(await service.create(rolesCreateData)).toBe(roleMock);

      expect(em.persistAndFlush).toHaveBeenCalledWith(roleMock);
    });

    it('should throw an error if role not created', async () => {
      try {
        jest.spyOn(em, 'create').mockImplementation(() => {
          throw new Error();
        });
        await service.create({
          name: 'admin',
          permissions: [],
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('delete', () => {
    it('should delete a role', async () => {
      const roleMock: Roles = orm.em.create(Roles, {
        name: 'admin',
        permissions: [],
      });
      jest.spyOn(em, 'findOne').mockResolvedValue(roleMock);
      expect(await service.delete('1')).toBe(roleMock);
      expect(em.removeAndFlush).toHaveBeenCalledWith(roleMock);
    });

    it('should throw an error if role not found', async () => {
      try {
        jest.spyOn(em, 'findOne').mockResolvedValue(null);
        await service.delete('1');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('assign', () => {
    it('should assign a role to a user', async () => {
      const roleMock: Roles = orm.em.create(Roles, {
        name: 'admin',
        permissions: [],
      });
      const userMock = orm.em.create(User, {
        email: 'test@test',
        role: roleMock,
      });

      jest.spyOn(em, 'findOne').mockResolvedValueOnce(userMock);
      jest.spyOn(em, 'findOne').mockResolvedValueOnce(roleMock);
      expect(await service.assign('1', '1')).toBe(userMock);
      expect(em.persistAndFlush).toHaveBeenCalledWith(userMock);
    });

    it('should throw an error if user not found', async () => {
      try {
        jest.spyOn(em, 'findOne').mockResolvedValue(null);
        await service.assign('1', '1');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should throw an error if role not found', async () => {
      try {
        jest.spyOn(em, 'findOne').mockResolvedValueOnce({});
        jest.spyOn(em, 'findOne').mockResolvedValueOnce(null);
        await service.assign('1', '1');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('addPermissionToRole', () => {
    it('should add permissions to a role', async () => {
      const roleMock: Roles = orm.em.create(Roles, {
        name: 'admin',
        permissions: [],
      });

      jest.spyOn(em, 'findOne').mockResolvedValue(roleMock);
      const role = await service.addPermissionToRole('1', [
        {
          context: 'users',
          action: 'read',
        },
      ]);

      expect(role.permissions).toHaveLength(1);
    });

    it('should throw an error if role not found', async () => {
      try {
        jest.spyOn(em, 'findOne').mockResolvedValue(null);
        await service.addPermissionToRole('1', []);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it("Should replace existing permission if the action of the upcoming permission has 'all' as action", async () => {
      const roleMock: Roles = orm.em.create(Roles, {
        name: 'admin',
        permissions: [
          {
            context: 'users',
            action: 'read',
          },
        ],
      });
      jest.spyOn(em, 'findOne').mockResolvedValue(roleMock);
      const role = await service.addPermissionToRole('1', [
        {
          context: 'users',
          action: 'all',
        },
      ]);
      expect(role.permissions).toHaveLength(1);
      expect(role.permissions[0].action).toBe('all');
    });
  });

  describe('removePermissionFromRole', () => {
    it('should remove permissions from a role', async () => {
      const roleMock: Roles = orm.em.create(Roles, {
        name: 'admin',
        permissions: [
          {
            context: 'users',
            action: 'read',
          },
        ],
      });

      jest.spyOn(em, 'findOne').mockResolvedValue(roleMock);
      const role = await service.removePermissionFromRole('1', [
        {
          context: 'users',
          action: 'read',
        },
      ]);

      expect(role.permissions).toHaveLength(0);
    });

    it('should throw an error if role not found', async () => {
      try {
        jest.spyOn(em, 'findOne').mockResolvedValue(null);
        await service.removePermissionFromRole('1', []);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('removeRolefromUser', () => {
    it('should remove role from a user', async () => {
      const roleMock: Roles = orm.em.create(Roles, {
        name: 'admin',
        permissions: [],
      });
      const userMock = orm.em.create(User, {
        email: 'test@test',
        role: roleMock,
      });

      jest.spyOn(em, 'findOne').mockResolvedValue(userMock);
      const user = await service.removeRoleFromUser('1');

      expect(user.role).toBeNull();
    });

    it('should throw an error if user not found', async () => {
      try {
        jest.spyOn(em, 'findOne').mockResolvedValue(null);
        await service.removeRoleFromUser('1');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});

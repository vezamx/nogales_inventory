import { Request } from 'express';

export type JWTPayload = {
  id: string;
  roleId: string;
};

export type CustomRequest = Request & {
  user: string;
};
export enum EPermissionContext {
  USERS = 'users',
  ROLES = 'roles',
  PERMISSIONS = 'permissions',
  INSUMOS = 'insumos',
  PRODUCTOS = 'productos',
}
export enum EPermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  ALL = 'all',
}

export type TPermission = {
  context: `${EPermissionContext}`;
  action: `${EPermissionAction}`;
};

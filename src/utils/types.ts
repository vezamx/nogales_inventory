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
  TRANSACTIONS = 'transactions',
}
export enum EPermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  ALL = 'all',
}
export type TPermissionContext = `${EPermissionContext}`;
export type TPermissionAction = `${EPermissionAction}`;
export type TPermission = {
  context: TPermissionContext;
  action: TPermissionAction;
};

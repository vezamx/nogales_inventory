import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { RolesService } from '../roles/roles.service';
import { CustomRequest, EPermissionContext, JWTPayload } from '../utils/types';
require('dotenv').config();

enum MapMethodToAction {
  GET = 'read',
  POST = 'create',
  PUT = 'update',
  DELETE = 'delete',
}
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly rolesService: RolesService) {}
  private logger = new Logger(AuthGuard.name);
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: CustomRequest = context.switchToHttp().getRequest();

    const isPublic = Reflect.getMetadata('public', context.getHandler());
    if (isPublic) {
      return true;
    }

    if (!request.headers.authorization) {
      return false;
    }
    const [_, token] = request.headers.authorization.split(' ');

    const { id, roleId } = verify(token, process.env.JWT_SECRET) as JWTPayload;

    if (!id || !roleId) {
      this.logger.error('Error en el token, invalido o alterado');
      return false;
    }

    const userRole = await this.rolesService.findOne(roleId);

    const contexto = Object.values(EPermissionContext).find((value) =>
      request.url.includes(value),
    );

    //logica para verificar si el usuario tiene el rol necesario dpendiendo el metodo y la ruta

    if (!contexto) {
      return false;
    }

    const permiso = userRole.permissions.find(
      (permission) =>
        (permission.context === contexto &&
          permission.action === MapMethodToAction[request.method]) ||
        permission.action === 'all',
    );

    if (!permiso) {
      return false;
    }

    request.user = id;

    return true;
  }
  catch(error) {
    this.logger.error('Error en la autenticación', error.message);
    return false;
  }
}

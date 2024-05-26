import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';
import { JWTPayload } from 'src/utils/types';
require('dotenv').config();

export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const isPublic = Reflect.getMetadata('public', context.getHandler());
    if (isPublic) {
      return true;
    }

    if (!request.headers.authorization) {
      return false;
    }
    const roles = Reflect.getMetadata('roles', context.getHandler());

    try {
      const [_, token] = request.headers.authorization.split(' ');

      const { id, role } = verify(token, process.env.JWT_SECRET) as JWTPayload;

      if (!roles || roles.length === 0) {
        request.user = { id, role };
        return request;
      }

      if (!roles.includes(role)) {
        return false;
      }

      request.user = { id, role };

      return request;
    } catch (error) {
      console.log('Valio queso la autenticacion');
      return false;
    }
  }
}

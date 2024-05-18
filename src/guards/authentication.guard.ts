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

    if (!request.headers.Authorization) {
      return false;
    }

    const roles = Reflect.getMetadata('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const { id, role } = verify(
      request.headers.Authorization,
      process.env.JWT_SECRET,
    ) as JWTPayload;

    if (!roles.includes(role)) {
      return false;
    }

    request.user = { id, role };

    return true;
  }
}

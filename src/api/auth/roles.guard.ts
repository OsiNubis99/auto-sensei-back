import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { ROLES_KEY } from '@common/decorators/can-access-roles.decorator';
import { UserTypeEnum } from '@common/enums/user-type.enum';
import { User } from '@database/schemas/user.schema';

@Injectable()
export class RolesAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<UserTypeEnum[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!roles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    const hasRole = () => roles.some((role) => user.type == role);

    return user && hasRole();
  }
}

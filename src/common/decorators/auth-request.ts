import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { UserTypeEnum } from '@common/enums/user-type.enum';

import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { RolesAuthGuard } from '@auth/roles.guard';
import { BasicRequest, BasicRequestI } from './basic-request';
import { CanAccessRoles } from './can-access-roles.decorator';

export interface AuthRequestI extends BasicRequestI {
  roles?: UserTypeEnum[];
}

export function AuthRequest({ roles, ...data }: AuthRequestI) {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesAuthGuard),
    CanAccessRoles(roles || []),
    BasicRequest(data),
  );
}

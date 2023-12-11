import { SetMetadata } from '@nestjs/common';
import { UserTypeEnum } from '@common/enums/user-type.enum';

export const ROLES_KEY = 'roles';

export const CanAccessRoles = (roles: UserTypeEnum[]) =>
  SetMetadata(ROLES_KEY, roles);

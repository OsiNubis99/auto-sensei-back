import { applyDecorators, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { BasicRequest } from './basic-request';

export function AuthRequest<T>() {
  return applyDecorators(UseGuards(JwtAuthGuard), BasicRequest<T>());
}

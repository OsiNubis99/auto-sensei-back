import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { BasicRequest, BasicRequestI } from './basic-request';

export function AuthRequest<T>(data: BasicRequestI) {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
    BasicRequest<T>(data),
  );
}

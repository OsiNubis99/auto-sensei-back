import { applyDecorators, UseInterceptors } from '@nestjs/common';

import { LoggerInterceptor } from '@common/interceptor/logger.interceptor';
import { EitherResponseInterceptor } from '@common/interceptor/either-response.interceptor';

export interface BasicRequestI {
  code?: number;
}

export function BasicRequest<T>() {
  return applyDecorators(
    UseInterceptors(EitherResponseInterceptor<T>),
    UseInterceptors(LoggerInterceptor<T>),
  );
}

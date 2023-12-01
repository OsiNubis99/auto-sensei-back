import { applyDecorators, HttpCode, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { EitherResponseInterceptor } from '@common/interceptor/either-response.interceptor';
import { LoggerInterceptor } from '@common/interceptor/logger.interceptor';

export interface BasicRequestI {
  description: string;
  response: string;
  code?: number;
}

export function BasicRequest<T>(data: BasicRequestI) {
  return applyDecorators(
    ApiOperation({
      description: data.description,
    }),
    ApiOkResponse({
      description: data.response,
    }),
    ApiUnauthorizedResponse({
      description: 'You are not authorized for execute this method',
    }),
    ApiBadRequestResponse({
      description: 'Some data that you sent is not valid',
    }),
    ApiInternalServerErrorResponse({
      description: 'You got an error that we do not are prepared for',
    }),
    UseInterceptors(LoggerInterceptor),
    UseInterceptors(EitherResponseInterceptor<T>),
    HttpCode(data.code || 200),
  );
}

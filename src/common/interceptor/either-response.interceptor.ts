import {
  CallHandler,
  ExecutionContext,
  HttpException,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

import { Either } from '@common/generics/Either';

export class EitherResponseInterceptor<T> implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<T | HttpException> {
    return next.handle().pipe(
      map((data: Either<T>) => {
        if (data.isLeft()) throw data.getLeft();
        return data.getRight();
      }),
    );
  }
}

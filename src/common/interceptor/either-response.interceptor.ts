import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

import { Either } from '@common/generics/either';

export class EitherResponseInterceptor<T, E> implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<T | E> {
    return next.handle().pipe(
      map((data: Either<T, E>) => {
        if (data.isLeft()) throw data.getLeft();
        return data.getRight();
      }),
    );
  }
}

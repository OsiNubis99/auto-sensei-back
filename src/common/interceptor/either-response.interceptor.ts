import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

import { Either } from '@common/generics/either';

export class EitherResponseInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      map((data: Either<unknown, unknown>) => {
        if (data.isLeft()) throw data.getLeft();
        return data.getRight();
      }),
    );
  }
}

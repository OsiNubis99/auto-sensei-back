import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { Either } from '@common/generics/either';

export class EitherGatewayInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      map((data: Either<unknown, unknown>) => {
        if (data.isLeft()) return data.getLeft();
        return data.getRight();
      }),
    );
  }
}

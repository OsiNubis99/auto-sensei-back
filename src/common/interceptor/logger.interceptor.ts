import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { map, Observable } from 'rxjs';

import { Either } from '@common/generics/Either';

export class LoggerInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Either<T>> {
    const now = Date.now();
    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo();
    return next.handle().pipe(
      map((data: Either<T>) => {
        Logger.log(
          `Method: ${info.fieldName} Error: ${data.isLeft()} ${
            Date.now() - now
          }ms`,
          context.getClass().name,
        );
        return data;
      }),
    );
  }
}

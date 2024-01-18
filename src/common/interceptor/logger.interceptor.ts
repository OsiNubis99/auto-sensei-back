import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';

export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const now = Date.now();
    if (context.getType() === 'ws') {
      return next.handle().pipe(
        map((data) => {
          Logger.log(`WS ${Date.now() - now}ms`, context.getClass().name);
          return data;
        }),
      );
    }
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    return next.handle().pipe(
      map((data) => {
        Logger.log(
          `${method} ${url} ${Date.now() - now}ms`,
          context.getClass().name,
        );
        return data;
      }),
    );
  }
}

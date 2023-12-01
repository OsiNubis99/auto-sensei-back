import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';

export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const now = Date.now();
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

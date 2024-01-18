import { Either } from './either';
import { AppServiceI } from './app-service.interface';

export abstract class Decorator<P, R, E> implements AppServiceI<P, R, E> {
  private service: AppServiceI<P, R, E>;

  constructor(service: AppServiceI<P, R, E>) {
    this.service = service;
  }

  async execute(d: P): Promise<Either<R, E>> {
    return this.service.execute(d);
  }
}

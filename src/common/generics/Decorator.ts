import { Either } from './Either';
import { IAppService } from './IAppService';

export abstract class Decorator<P, R> implements IAppService<P, R> {
  private service: IAppService<P, R>;

  constructor(service: IAppService<P, R>) {
    this.service = service;
  }

  async execute(d: P): Promise<Either<R>> {
    return this.service.execute(d);
  }
}

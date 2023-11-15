import { Either } from './Either';

export interface IAppService<P, R> {
  execute(param: P): Promise<Either<R>>;
}

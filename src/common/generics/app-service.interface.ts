import { Either } from './either';

export interface AppServiceI<P, R, E> {
  execute(param: P): Promise<Either<R, E>>;
}

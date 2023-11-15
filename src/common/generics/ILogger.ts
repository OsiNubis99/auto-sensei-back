import { Either } from './Either';

export interface ILogger<T> {
  execute(action: string, result: T): Promise<Either<T>>;
}

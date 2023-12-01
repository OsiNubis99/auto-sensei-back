import { HttpException, HttpStatus } from '@nestjs/common';

export class Either<T> {
  private readonly value: HttpException | T;

  private constructor(value: HttpException | T) {
    this.value = value;
  }

  isLeft(): boolean {
    return this.value instanceof HttpException;
  }

  getLeft(): HttpException {
    if (!this.isLeft()) throw new Error('Call-Bad-Side');
    return <HttpException>this.value;
  }

  isRight(): boolean {
    return !this.isLeft();
  }

  getRight(): T {
    if (this.isLeft()) throw new Error('Call-Bad-Side');
    return <T>this.value;
  }

  static makeLeft(message: string, code: HttpStatus): Either<null> {
    return new Either<null>(new HttpException(message, code));
  }

  static makeRight<T>(value: T): Either<T> {
    return new Either<T>(value);
  }
}

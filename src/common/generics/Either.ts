export class Either<T> {
  private readonly value: Error | T;

  private constructor(value: Error | T) {
    this.value = value;
  }

  isLeft(): boolean {
    return this.value instanceof Error;
  }

  getLeft(): Error {
    if (!this.isLeft()) throw new Error('Call-Bad-Side');
    return <Error>this.value;
  }

  isRight(): boolean {
    return !this.isLeft();
  }

  getRight(): T {
    if (this.isLeft()) throw new Error('Call-Bad-Side');
    return <T>this.value;
  }

  static makeLeft(value: string): Either<null> {
    return new Either<null>(Error(value));
  }

  static makeRight<T>(value: T): Either<T> {
    return new Either<T>(value);
  }
}

export class Either<T, E> {
  private readonly value: T | E;

  private constructor(value: T | E, private readonly error = false) {
    this.value = value;
  }

  isLeft(): boolean {
    return this.error;
  }

  isRight(): boolean {
    return !this.isLeft();
  }

  getLeft() {
    if (!this.isLeft()) throw new Error('Call-Bad-Side');
    return <E>this.value;
  }

  getRight() {
    if (this.isLeft()) throw new Error('Call-Bad-Side');
    return <T>this.value;
  }

  static makeLeft<E>(error: E) {
    return new Either<null, E>(error, true);
  }

  static makeRight<T>(value: T) {
    return new Either<T, null>(value);
  }
}

export class Result<TValue = void> {
  private readonly _value?: TValue;
  private readonly _error?: string;

  private constructor(value?: TValue, error?: string) {
    this._value = value;
    this._error = error;
  }

  get value(): TValue {
    if (this._error) {
      throw new Error('Cannot access value because validation failed.');
    }

    return this._value!;
  }

  get error(): string {
    if (!this._error) {
      throw new Error('Cannot access error because validation succeeded.');
    }

    return this._error;
  }

  get isSuccess(): boolean {
    return !this._error;
  }

  get isFailure(): boolean {
    return !!this._error;
  }

  static ok<TValue = void>(value?: TValue): Result<TValue> {
    return new Result<TValue>(value);
  }

  static fail<TValue = void>(error: string): Result<TValue> {
    return new Result<TValue>(undefined, error);
  }
}

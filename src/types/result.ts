interface Success<T> {
  status: 'success';
  value: T;
}
interface Failure<E = Error> {
  status: 'failure';
  error: E;
}

export type Result<T, E = Error> = Success<T> | Failure<E>;

export const tryResult = <T>(fn: () => T): Result<T> => {
  try {
    return {status: 'success', value: fn()};
  } catch (error) {
    return {
      status: 'failure',
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

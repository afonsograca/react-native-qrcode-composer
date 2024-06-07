interface Success<T> {
  status: 'success';
  value: T;
}
interface Failure<E = Error> {
  status: 'failure';
  error: E;
}

export type Result<T, E = Error> = Success<T> | Failure<E>;

import type { CancellationToken } from "./cancellation-token";

export type Resolve<T> = (value: T) => void;
export type Reject = (err: Error) => void;
export type Abort = (err: Error) => void;
export type Abortable<T> = (resolve: Resolve<T>, reject: Reject) => Abort;

export function abortify<Result = void>(
  factory: () => Abortable<Result>
): (token: CancellationToken) => Promise<Result>;

export function abortify<A, Result = void>(
  factory: (a: A) => Abortable<Result>
): (a: A, token: CancellationToken) => Promise<Result>;

export function abortify<A, B, Result = void>(
  factory: (a: A, b: B) => Abortable<Result>
): (a: A, b: B, token: CancellationToken) => Promise<Result>;

export function abortify<A, B, C, Result = void>(
  factory: (a: A, b: B, c: C) => Abortable<Result>
): (a: A, b: B, c: C, token: CancellationToken) => Promise<Result>;

export function abortify<A, B, C, D, Result = void>(
  factory: (a: A, b: B, c: C, d: D) => Abortable<Result>
): (a: A, b: B, c: C, d: D, token: CancellationToken) => Promise<Result>;

export function abortify<A, B, C, D, E, Result = void>(
  factory: (a: A, b: B, c: C, d: D, e: E) => Abortable<Result>
): (a: A, b: B, c: C, d: D, e: E, token: CancellationToken) => Promise<Result>;

export function abortify<Result>(
  factory: (...args: unknown[]) => Abortable<Result>
): (...args: unknown[]) => Promise<Result> {
  return (...args: unknown[]): Promise<Result> => {
    const token = args.pop() as CancellationToken;

    return new Promise<Result>((resolve, reject) => {
      const abortable = factory(...args);

      let unsubscribe = (): void => {
        reject(new Error("Resolve or reject called synchronously"));
      };

      unsubscribe = token.subscribe(
        abortable(
          (val) => {
            unsubscribe();
            resolve(val);
          },
          (err) => {
            unsubscribe();
            reject(err);
          }
        )
      );
    });
  };
}

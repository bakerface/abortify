type CancellationListener = (err: Error) => void;
type Unsubscribe = () => void;
interface CancellationToken {
    subscribe(fn: CancellationListener): Unsubscribe;
}
type Resolve<T> = (value: T) => void;
type Reject = (err: Error) => void;
type Abort = (err: Error) => void;
type Abortable<T> = (resolve: Resolve<T>, reject: Reject) => Abort;
declare function abortify<Result = void>(factory: () => Abortable<Result>): (token: CancellationToken) => Promise<Result>;
declare function abortify<A, Result = void>(factory: (a: A) => Abortable<Result>): (a: A, token: CancellationToken) => Promise<Result>;
declare function abortify<A, B, Result = void>(factory: (a: A, b: B) => Abortable<Result>): (a: A, b: B, token: CancellationToken) => Promise<Result>;
declare function abortify<A, B, C, Result = void>(factory: (a: A, b: B, c: C) => Abortable<Result>): (a: A, b: B, c: C, token: CancellationToken) => Promise<Result>;
declare function abortify<A, B, C, D, Result = void>(factory: (a: A, b: B, c: C, d: D) => Abortable<Result>): (a: A, b: B, c: C, d: D, token: CancellationToken) => Promise<Result>;
declare function abortify<A, B, C, D, E, Result = void>(factory: (a: A, b: B, c: C, d: D, e: E) => Abortable<Result>): (a: A, b: B, c: C, d: D, e: E, token: CancellationToken) => Promise<Result>;
declare class CancellationTokenSource implements CancellationToken {
    private _err;
    private _fns;
    constructor();
    subscribe(fn: CancellationListener): Unsubscribe;
    cancel(err: Error): void;
    private _settle;
}
/**
 * Sleeps for the specified duration (in milliseconds).
 *
 * @param {number} ms - The number of milliseconds.
 * @param {import("./cancellation-token").CancellationToken} token - The cancellation token.
 * @returns {Promise<void>}
 */
declare const sleep: (a: number, token: CancellationToken) => Promise<void>;
export { Resolve, Reject, Abort, Abortable, abortify, CancellationTokenSource, CancellationListener, Unsubscribe, CancellationToken, sleep };

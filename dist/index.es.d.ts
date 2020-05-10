type CancellationListener = (err: Error) => void;
type Unsubscribe = () => void;
interface CancellationTokenContract {
    subscribe(fn: CancellationListener): Unsubscribe;
}
declare class CancellationTokenSource implements CancellationTokenContract {
    private _err;
    private _fns;
    constructor();
    subscribe(fn: CancellationListener): Unsubscribe;
    cancel(err: Error): void;
    private _settle;
}
declare const CancellationToken: CancellationTokenContract;
declare function sleep(ms: number, token?: CancellationTokenContract): Promise<void>;
export { CancellationListener, Unsubscribe, CancellationTokenContract, CancellationTokenSource, CancellationToken, sleep };

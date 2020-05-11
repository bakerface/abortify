import type {
  CancellationToken,
  CancellationListener,
  Unsubscribe,
} from "./cancellation-token";

export class CancellationTokenSource implements CancellationToken {
  private _err: Error | undefined;
  private _fns: CancellationListener[];

  public constructor() {
    this._fns = [];
    this._settle = this._settle.bind(this);
  }

  public subscribe(fn: CancellationListener): Unsubscribe {
    const handle = setImmediate(this._settle);
    this._fns.push(fn);

    return (): void => {
      clearImmediate(handle);
      this._fns = this._fns.filter((f) => f !== fn);
    };
  }

  public cancel(err: Error): void {
    this._err = err;
    setImmediate(this._settle);
  }

  private _settle(): void {
    const err = this._err;

    if (err) {
      this._fns.splice(0).forEach((fn) => fn(err));
    }
  }
}

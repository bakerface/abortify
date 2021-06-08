import { AbortError } from "./abort-error";

export type Resolve<T> = (value: T) => void;
export type Reject = (err: Error) => void;
export type Abort = () => void;
export type Abortable<T> = (resolve: Resolve<T>, reject: Reject) => Abort;

const None: AbortSignal = {
  onabort: Boolean,
  dispatchEvent: Boolean,
  addEventListener: Boolean,
  removeEventListener: Boolean,
  aborted: false,
};

export function abortable<T>(
  abortable: Abortable<T>,
  signal = None
): Promise<T> {
  return new Promise<T>((res, rej) => {
    function cleanup() {
      signal.removeEventListener("abort", aborted);
      cancel();
    }

    function resolve(value: T) {
      cleanup();
      res(value);
    }

    function reject(err: Error) {
      cleanup();
      rej(err);
    }

    function aborted() {
      reject(new AbortError());
    }

    const cancel = abortable(resolve, reject);

    signal.addEventListener("abort", aborted);

    if (signal.aborted) {
      aborted();
    }
  });
}

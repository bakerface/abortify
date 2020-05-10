import { CancellationToken } from "./cancellation-token";

export function sleep(ms: number, token = CancellationToken): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const handle = setTimeout(() => {
      unsubscribe(); // eslint-disable-line @typescript-eslint/no-use-before-define
      resolve();
    }, ms);

    const unsubscribe = token.subscribe((err) => {
      clearTimeout(handle);
      reject(err);
    });
  });
}

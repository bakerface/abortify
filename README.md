# abortify
**A cancellation token implementation in typescript**

## A quick example

``` typescript
import { CancellationToken, CancellationTokenSource, sleep } from "abortify";

async function forever(token = CancellationToken): Promise<never> {
  for (;;) {
    await sleep(1000, token);
    console.log("another second has passed");
  }
}

async function main(): Promise<void> {
  // create a source at the top level
  const source = new CancellationTokenSource();

  setTimeout(() => {
    // some time later, use the source to cancel all operations
    source.cancel(new Error("The operation was cancelled"));
  }, 5000);

  try {
    // although this promise never resolves,
    // when the token is cancelled the promise is rejected
    await forever(source);
  } catch (err) {
    console.error(err); // Error: The operation was cancelled
  }
}

main();
```

## The CancellationToken contract
A CancellationToken exposes a function allowing the caller to subscribe to
future cancellations. If subscribing to a cancellation token that has already
been cancelled, the callback will be called after the event loop is unwound.
This guarantees that `unsubscribe` will be assigned before the callback is
invoked. Subscribers are automatically unsubscribed when the callback is
called. Consider a sample `sleep` implementation below.

``` typescript
import { CancellationToken } from "abortify";

export function sleep(ms: number, token = CancellationToken): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const handle = setTimeout(() => {
      unsubscribe();
      resolve();
    }, ms);

    const unsubscribe = token.subscribe((err) => {
      clearTimeout(handle);
      reject(err);
    });
  });
}
```

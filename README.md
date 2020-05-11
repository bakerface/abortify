# abortify
**A cancellation token implementation in typescript**

## Abortables
An abortable is a function that accepts a resolve and reject function (the same
as the Promise constructor) and returns a function for aborting the operation.
The abortify function converts abortables to abortable async functions using
cancellation tokens. Consider a sample `sleep` implementation below.

``` typescript
import { abortify, Abortable, Abort } from "abortify";

// this function creates an abortable that waits for `ms` milliseconds
const wait = (ms: number): Abortable<void> => (resolve, reject): Abort => {
  const handle = setTimeout(resolve, ms);

  return (err): void => {
    clearTimeout(handle);
    reject(err);
  };
};

// convert the wait function above to an async function
export const sleep = abortify(wait);
```

## Using the abortified functions

``` typescript
import { CancellationToken, CancellationTokenSource, sleep } from "abortify";

async function forever(token: CancellationToken): Promise<never> {
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

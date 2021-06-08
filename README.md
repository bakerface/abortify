# abortify
**Create abortable async functions with ease**

## Abortables
An abortable is a function that accepts a resolve and reject function (the same
as the Promise constructor) and returns a function for aborting the operation.
The abortify function converts works similar to `util.promisify` in that it
converts the abortable to a function that returns a promise. In addition,
abortify adds an optional argument allowing the user to pass an `AbortSignal`
to cancel the promise.

Below is an example of an abortified sleep function (also provided by this
package to fulfill a common use case).

``` typescript
import { Abortable, abortify } from "abortify";

// typeof sleep == (ms: number, signal?: AbortSignal) => Promise<void>
export const sleep = abortify(createAbortableSleep);

function createAbortableSleep(ms: number): Abortable<void> {
  return (resolve, reject) => {
    const handle = setTimeout(resolve, ms);
    return () => clearTimeout(handle);
  };
}
```

Once you have abort

``` typescript
import { sleep } from "abortify";

async function forever(signal: AbortSignal) {
  for (;;) {
    await sleep(1000, signal);
    console.log("another second has passed");
  }
}

async function main() {
  const controller = new AbortController();

  // abort after a short amount of time
  setTimeout(() => controller.abort(), 5000);

  try {
    await forever(controller.signal);
  } catch (err) {
    console.error(err); // AbortError: The user aborted the request
  }
}

main();
```

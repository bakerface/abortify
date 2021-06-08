# abortify
**Create abortable async functions with ease**

## Abortable

An **abortable** is an asynchronous function that can be aborted. An abortable
is passed a `resolve` and `reject` callback, just like the `Promise`
constructor, and returns a function for aborting the operation. Consider the
following definition of an abortable version of `setTimeout`:

``` typescript
import type { Abortable } from "abortify";

export function setAbortableTimeout(ms: number): Abortable<void> {
  return (resolve, reject) => {
    const handle = setTimeout(resolve, ms);
    return () => clearTimeout(handle);
  };
}
```

## abortify

The `abortify` function converts abortable functions into functions that return
a `Promise`. It works just like `util.promisify`, with a few additions:

- The function will accept an `AbortSignal` as an optional final argument.
- The function will throw an `AbortError` when the signal is aborted.
- The abortable will be aborted before the promise resolves or rejects.

Consider the following definition of an abortified version of the
`setAbortableTimeout` above:

``` typescript
import { abortify } from "abortify";

export const sleep = abortify(setAbortableTimeout);

// The sleep function above has the following signature:
// (ms: number, signal?: AbortSignal) => Promise<void>
```

## Using abortified functions

Once you have abortified a function you use it just like any other async
function. Consider the following example:

``` typescript
import { sleep } from "abortify";

// this function will print a message every second
// this function will only exit when the signal is aborted
async function forever(signal?: AbortSignal) {
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
    if (err.aborted) {
      console.error(err); // AbortError: The operation was aborted
    }
  }
}

main();
```

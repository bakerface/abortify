import { CancellationToken, CancellationTokenSource, sleep } from "../src";

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

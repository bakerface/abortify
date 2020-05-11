import { CancellationToken, CancellationTokenSource, sleep } from "../src";

async function work(ms: number, token: CancellationToken): Promise<number> {
  await sleep(ms, token);
  return 42;
}

async function timeout(ms: number, token: CancellationToken): Promise<never> {
  await sleep(ms, token);
  throw new Error(`The operation timed out after ${ms}ms`);
}

async function main(): Promise<void> {
  const token = new CancellationTokenSource();
  const startedAt = Date.now();

  const race = Promise.race([
    work(1000, token), // complete after one second
    work(60000, token), // complete after one minute
    timeout(5000, token), // timeout after five seconds
  ]);

  const value = await race.finally(() => {
    // the first promise has completed
    // now we will cancel the others
    token.cancel(new Error("The operation was cancelled"));
  });

  const elapsed = Date.now() - startedAt;
  console.log(`Computed the value ${value} in ${elapsed}ms`);
}

main().catch(console.error);

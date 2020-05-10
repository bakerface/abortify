import * as assert from "assert";
import { CancellationTokenSource, sleep } from "../src";

function floor(n: number, factor = 10): number {
  return Math.floor(n / factor) * factor;
}

function elapsed(startedAt: number, endedAt: number): number {
  return floor(endedAt - startedAt);
}

describe("sleep", () => {
  it("waits for the specified number of milliseconds", async () => {
    const source = new CancellationTokenSource();
    const startedAt = Date.now();
    await sleep(100, source);
    const endedAt = Date.now();
    const ms = elapsed(startedAt, endedAt);

    assert.deepEqual(ms, 100);
  });

  it("can be cancelled before it is started", async () => {
    const source = new CancellationTokenSource();
    source.cancel(new Error("cancelled"));

    const startedAt = Date.now();
    await assert.rejects(() => sleep(1000, source), new Error("cancelled"));
    const endedAt = Date.now();
    const ms = elapsed(startedAt, endedAt);

    assert.deepEqual(ms, 0);
  });

  it("can be cancelled after it has started", async () => {
    const source = new CancellationTokenSource();

    const startedAt = Date.now();
    setTimeout(() => source.cancel(new Error("cancelled")), 100);
    await assert.rejects(() => sleep(1000, source), new Error("cancelled"));
    const endedAt = Date.now();
    const ms = elapsed(startedAt, endedAt);

    assert.deepEqual(ms, 100);
  });
});

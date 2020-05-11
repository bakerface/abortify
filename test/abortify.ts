import * as assert from "assert";
import { Abort, Abortable, CancellationTokenSource, abortify } from "../src";

const syncResolve = abortify(
  (): Abortable<void> => (resolve, reject): Abort => {
    resolve();
    return reject;
  }
);

const syncReject = abortify(
  (): Abortable<void> => (_resolve, reject): Abort => {
    reject(new Error("The operation was rejected"));
    return reject;
  }
);

describe("abortify", () => {
  it("should throw an error when resolve is called synchronously", async () => {
    const token = new CancellationTokenSource();
    const err = new Error("Resolve or reject called synchronously");

    await assert.rejects(syncResolve(token), err);
  });

  it("should throw an error when reject is called synchronously", async () => {
    const token = new CancellationTokenSource();
    const err = new Error("Resolve or reject called synchronously");

    await assert.rejects(syncReject(token), err);
  });
});

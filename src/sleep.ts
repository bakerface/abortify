import { abortify, Abortable, Abort } from "./abortify";

const wait = (ms: number): Abortable<void> => (resolve, reject): Abort => {
  const handle = setTimeout(resolve, ms);

  return (err): void => {
    clearTimeout(handle);
    reject(err);
  };
};

/**
 * Sleeps for the specified duration (in milliseconds).
 *
 * @param {number} ms - The number of milliseconds.
 * @param {import("./cancellation-token").CancellationToken} token - The cancellation token.
 * @returns {Promise<void>}
 */
export const sleep = abortify(wait);

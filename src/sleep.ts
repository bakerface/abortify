import type { Abortable } from "./abortable";
import { abortify } from "./abortify";

export const sleep = abortify(createAbortableSleep);

function createAbortableSleep(ms: number): Abortable<void> {
  return (resolve) => {
    const handle = setTimeout(resolve, ms);
    return () => clearTimeout(handle);
  };
}

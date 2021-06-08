import { Abortable, abortable } from "./abortable";

export type AbortableFactory<Args extends any[], Return> = (
  ...args: Args
) => Abortable<Return>;

export type ArgsWithAbortSignal<Args extends any[]> = [
  ...args: Args,
  signal?: AbortSignal
];

export type Abortified<Args extends any[], Return> = (
  ...args: ArgsWithAbortSignal<Args>
) => Promise<Return>;

export function abortify<Args extends any[], Return>(
  factory: AbortableFactory<Args, Return>
): Abortified<Args, Return> {
  return (...args) => {
    let signal = args.pop() as AbortSignal | undefined;
    const params = args as unknown as Args;

    if (!signal || typeof signal.aborted !== "boolean") {
      params.push(signal);
      signal = undefined;
    }

    return abortable(factory(...params), signal);
  };
}

export type CancellationListener = (err: Error) => void;
export type Unsubscribe = () => void;

export interface CancellationToken {
  subscribe(fn: CancellationListener): Unsubscribe;
}

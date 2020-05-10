export type CancellationListener = (err: Error) => void;
export type Unsubscribe = () => void;

export interface CancellationTokenContract {
  subscribe(fn: CancellationListener): Unsubscribe;
}

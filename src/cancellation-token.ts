import type { CancellationTokenContract } from "./cancellation-token-contract";
import { CancellationTokenSource } from "./cancellation-token-source";

export const CancellationToken: CancellationTokenContract = new CancellationTokenSource();

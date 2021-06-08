export class AbortError extends Error {
  public readonly aborted: true;

  constructor(message = "The operation was aborted.") {
    super(message);
    this.name = "AbortError";
    this.aborted = true;
  }
}

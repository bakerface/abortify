export class AbortError extends Error {
  constructor(message = "The user aborted the request.") {
    super(message);
    this.name = "AbortError";
  }
}

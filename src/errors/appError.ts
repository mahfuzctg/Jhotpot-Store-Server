class AppError extends Error {
  public statusCode: number; // The HTTP status code for the error.

  constructor(statusCode: number, message: string, stack = "") {
    super(message); // Calls the parent `Error` constructor with the message.
    this.statusCode = statusCode; // Set the statusCode for the error.

    // If a stack is passed, set it; otherwise, capture the current stack trace.
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor); // Captures the current call stack.
    }
  }
}

export default AppError;

// Operational errors that carry an intended HTTP status and a client-safe message.
//
// Why: handlers previously built every failure response by hand, which is how
// four different response envelopes and cases like "201 with success: false"
// crept in. Throwing a typed error lets the service layer stay free of `res`
// and leaves status/format decisions to one place (middlewares/errorHandler).
class AppError extends Error {
  /**
   * @param {string} message  Safe to show the client.
   * @param {number} statusCode
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    // Distinguishes "expected" failures (bad input, wrong password) from
    // genuine bugs, so the error handler knows which messages are safe to
    // forward and which must be replaced with something generic.
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Named constructors, so call sites read as intent rather than status numbers.
const badRequest = (message) => new AppError(message, 400);
const unauthorized = (message) => new AppError(message, 401);
const notFound = (message) => new AppError(message, 404);
const conflict = (message) => new AppError(message, 409);

module.exports = { AppError, badRequest, unauthorized, notFound, conflict };

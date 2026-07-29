// Wraps an async route handler so a rejected promise reaches Express's error
// pipeline via next(err).
//
// Why this matters: Express 4 does not catch rejections from async handlers, and
// Node >=15 terminates the process on an unhandled rejection. Without this
// wrapper a single request that throws asynchronously takes the whole server
// down (and every open Socket.IO chat connection with it) instead of returning
// an error response. This also makes the previously-dead error middleware at the
// bottom of each router reachable, since handlers now actually call next(err).
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;

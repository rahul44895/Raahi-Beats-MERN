const multer = require("multer");
const { AppError } = require("../errors/AppError");
const {
  removeUploadedFile,
  removeUploadedFiles,
} = require("../Utils/fileCleanup");

// Terminal error middleware: turns anything thrown or passed to next(err) into
// one consistent response shape, and cleans up orphaned uploads on the way out.
//
// Centralizing the cleanup here is why the controller has no try/catch: the six
// scattered `deleteFiles(req.file)` calls in the old signup handler existed
// because every early return had to remember to do it. Any failure now routes
// through this one place, so a new validation rule cannot forget to clean up.
//
// Mounted per-router for now (at the bottom of routes/UsersRoute.js). It is
// written to be mountable globally in index.js once the remaining routers are
// migrated — see #9 in docs/backend-optimization-backlog.md, which also covers
// moving index.js's existing error middleware below the route registrations.
// eslint-disable-next-line no-unused-vars -- Express identifies error middleware by arity (4 args)
const errorHandler = async (err, req, res, next) => {
  await Promise.all([
    removeUploadedFile(req.file),
    removeUploadedFiles(req.files),
  ]);

  // Multer reports its own failures (file too large, unexpected field, and the
  // fileFilter rejections in middlewares/UserFileUpload.js) through next(err).
  // These are client mistakes, so they answer 400 with the specific reason.
  if (err instanceof multer.MulterError || err?.name === "MulterError") {
    return res.status(400).json({ success: false, error: err.message });
  }

  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ success: false, error: err.message });
  }

  // Anything reaching here is an unexpected bug, not an anticipated failure.
  // Log it in full for diagnosis but return a generic message: raw error text
  // can leak schema names, file paths, or driver internals to the client.
  console.error("Unhandled error:", err);
  return res.status(500).json({
    success: false,
    error: "Something went wrong. Please try again.",
  });
};

module.exports = errorHandler;

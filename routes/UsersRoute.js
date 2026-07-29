const express = require("express");

const UserFileUpload = require("../middlewares/UserFileUpload");
const errorHandler = require("../middlewares/errorHandler");
const userController = require("../controllers/user.controller.js");

const router = express.Router();

// Wiring only — method, path, middleware chain, handler. Business rules live in
// services/user.service.js, persistence in repositories/user.repository.js,
// input rules in validators/user.validator.js.

router.post(
  "/signup",
  UserFileUpload.single("userAvatar"),
  userController.signup
);

router.post("/login", userController.login);

router.get("/logout", userController.logout);

// Must stay last: Express only routes an error to middleware registered after
// the handler that produced it. Paired with asyncHandler in the controller, this
// is what makes rejected promises produce a response instead of an unhandled
// rejection — previously this router's error middleware was unreachable because
// no handler ever called next(err).
router.use(errorHandler);

module.exports = router;

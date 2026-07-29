const asyncHandler = require("../middlewares/asyncHandler");
const userService = require("../services/user.service");
const {
  validateSignup,
  validateLogin,
} = require("../validators/user.validator");
const { setAuthCookies, clearAuthCookies } = require("../Utils/authCookies");

// HTTP translation only: read the request, hand off, shape the response.
//
// There is deliberately no try/catch here. asyncHandler forwards any rejection
// to middlewares/errorHandler, which owns both the status/message mapping and
// the cleanup of orphaned avatar uploads — the concern that previously required
// six separate deleteFiles(req.file) calls in this one handler.
//
// The { success, message } / { success, error } envelope is load-bearing:
// client/src/Context/Authentication/AuthenticationState.js branches on
// `data.success` and displays `data.message` / `data.error`. It never reads the
// HTTP status code, which is why the corrected status codes in this refactor are
// invisible to the client but the envelope must stay exactly as it is.

// POST /api/users/signup
const signup = asyncHandler(async (req, res) => {
  const credentials = validateSignup(req.body);

  const { user, token } = await userService.registerUser({
    ...credentials,
    // multer has already written the file by the time this runs; the service
    // only needs its location, not the whole multer file object.
    avatarPath: req.file?.path,
  });

  setAuthCookies(res, { token, user });

  // 201 Created, where the original returned 200. Safe to correct because the
  // client checks `data.success`, not the status code.
  res.status(201).json({
    success: true,
    message: `Welcome! We are excited to welcome you, ${user.username}`,
  });
});

// POST /api/users/login
const login = asyncHandler(async (req, res) => {
  const credentials = validateLogin(req.body);

  const { user, token } = await userService.loginUser(credentials);

  setAuthCookies(res, { token, user });

  res.status(200).json({
    success: true,
    message: `Welcome! We are excited to welcome you, ${user.username}`,
  });
});

// GET /api/users/logout
const logout = asyncHandler(async (req, res) => {
  clearAuthCookies(res);

  res.status(200).json({ success: true, message: "Logged out successfully." });
});

module.exports = { signup, login, logout };

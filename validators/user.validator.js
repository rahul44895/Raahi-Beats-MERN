const { badRequest } = require("../errors/AppError");

// Input validation for the user domain.
//
// Kept as a plain module rather than a schema library so this refactor adds no
// dependency; the exported functions are shaped like a validation library's
// (take raw input, throw on invalid, return normalized output) so swapping in
// zod later is a change inside this file, not at every call site.
// See #26 in docs/backend-optimization-backlog.md.

// Unchanged from the original handler, and deliberately identical to the
// `match` on UserSchema.email so the two layers cannot disagree.
const EMAIL_PATTERN = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// At least one lowercase, one uppercase, one digit, one special char, min 8.
const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/~\\|-]).{8,}$/;

const MAX_USERNAME_LENGTH = 200;

const PASSWORD_REQUIREMENTS_MESSAGE =
  "Password must be atleast 8 characters long and should contain atleast a " +
  "small letter, capital letter, digits between 0-9 and atleast one special " +
  "character like !@#$%^&*()_+={}[]:;\"'<>,.?/~\\|-.";

// Guards every field access below.
//
// Why it comes first: the old handler called `username.length` and
// `email.match(...)` before establishing the fields existed, so a request with
// a missing field threw a TypeError that the catch block reported as a 500
// "please retry" — telling the client to retry a request that could never
// succeed. Presence is now checked up front and answers 400.
const assertPresent = (fields) => {
  for (const [name, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === "") {
      throw badRequest(`${name} is required.`);
    }
    if (typeof value !== "string") {
      throw badRequest(`${name} must be a string.`);
    }
  }
};

const validateSignup = (body = {}) => {
  const { username, email, password, confirmPassword } = body;

  assertPresent({ username, email, password, confirmPassword });

  if (username.length > MAX_USERNAME_LENGTH) {
    throw badRequest(
      "We appreciate your name, but it should be less than 200 characters for our system."
    );
  }

  if (!EMAIL_PATTERN.test(email)) {
    throw badRequest("Invalid Email");
  }

  if (!PASSWORD_PATTERN.test(password)) {
    throw badRequest(PASSWORD_REQUIREMENTS_MESSAGE);
  }

  if (password !== confirmPassword) {
    throw badRequest("Password and confirm password do not match.");
  }

  // Normalized on the way out so the service never re-trims.
  //
  // Trimming only. Email is deliberately NOT lowercased: EMAIL_PATTERN allows
  // [a-zA-Z], so mixed-case addresses already exist in the database, and
  // lowercasing at login would stop finding those accounts — locking out every
  // user who signed up with a capital letter. Case-insensitive email needs a
  // one-off migration plus a collation-aware unique index; until then the
  // stored casing is authoritative. (Trimming is safe by contrast: the anchored
  // regex rejects surrounding whitespace, so no stored email can contain any.)
  return {
    username: username.trim(),
    email: email.trim(),
    password,
  };
};

const validateLogin = (body = {}) => {
  const { email, password } = body;

  assertPresent({ email, password });

  // Matches validateSignup's normalization exactly (trim only, no case change).
  // If these two ever diverge, users become unable to log in with the address
  // they registered with.
  return { email: email.trim(), password };
};

module.exports = { validateSignup, validateLogin };

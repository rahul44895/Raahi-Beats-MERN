const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const config = require("../config");
const userRepository = require("../repositories/user.repository");
const { badRequest, unauthorized, conflict } = require("../errors/AppError");

// Business rules for the user domain. Knows nothing about req, res, cookies, or
// HTTP status codes — it throws typed errors and returns data, so it can be
// called from a test, a CLI script, or a future GraphQL layer unchanged.

const SALT_ROUNDS = 10;

// A real hash to compare against when no account matches the submitted email.
//
// Why: bcrypt comparison is deliberately slow, so returning early on "user not
// found" made failed logins measurably faster for unregistered addresses than
// for registered ones. That timing difference leaks which emails have accounts,
// which is the same thing the unified error message below is meant to prevent.
// Generated at boot (rather than hardcoded) so it is always a valid hash at the
// current cost factor — a malformed hash would fail instantly and defeat the point.
const DUMMY_PASSWORD_HASH = bcrypt.hashSync("unused-placeholder", SALT_ROUNDS);

// Shared by both failure branches of login, so the response cannot reveal
// whether the email exists or the password was wrong. The old handler returned
// 404 "User not found." vs 400 "Password is incorrect.", which let anyone
// enumerate registered accounts.
const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password.";

const issueToken = (userId) =>
  JWT.sign({ userID: userId }, config.jwt.secret, {
    // Previously omitted, which made every token valid forever — a copied token
    // never stopped working, and there was no way to revoke one.
    expiresIn: config.jwt.expiresIn,
  });

// Strips the password hash (and anything else the schema may gain later) before
// the user object travels outward.
//
// Why explicit allow-listing rather than `delete user.password`: a deny-list has
// to be updated every time a sensitive field is added to the schema, and missing
// one silently publishes it. This only ever exposes fields named here.
const toPublicUser = (user) => ({
  id: user._id.toString(),
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
});

/**
 * Registers a new user and issues their first token.
 * @returns {Promise<{user: object, token: string}>}
 */
const registerUser = async ({ username, email, password, avatarPath }) => {
  if (!avatarPath) {
    throw badRequest(
      "Please, give us a chance by uploading your profile picture to showcase your amazing face on our website."
    );
  }

  // Checked before hashing: bcrypt at 10 rounds costs ~100ms of CPU, and the
  // old order burned that on every duplicate-signup attempt before rejecting it.
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw conflict("Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  let user;
  try {
    user = await userRepository.create({
      username,
      email,
      password: hashedPassword,
      avatar: avatarPath,
    });
  } catch (error) {
    // The check above still leaves a window: two concurrent signups for the
    // same address both pass it, and the second insert trips the schema's
    // unique index. Translating E11000 here turns that race into the intended
    // 409 instead of a generic 500.
    if (error?.code === 11000) {
      throw conflict("Email is already registered");
    }
    throw error;
  }

  return { user: toPublicUser(user), token: issueToken(user._id) };
};

/**
 * Verifies credentials and issues a token.
 * @returns {Promise<{user: object, token: string}>}
 */
const loginUser = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);

  // Compare against the placeholder hash when the account does not exist, so
  // both branches take the same amount of time. See DUMMY_PASSWORD_HASH.
  const passwordMatches = await bcrypt.compare(
    password,
    user ? user.password : DUMMY_PASSWORD_HASH
  );

  if (!user || !passwordMatches) {
    throw unauthorized(INVALID_CREDENTIALS_MESSAGE);
  }

  return { user: toPublicUser(user), token: issueToken(user._id) };
};

module.exports = { registerUser, loginUser };

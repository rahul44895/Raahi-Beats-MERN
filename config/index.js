// Centralized, validated application configuration.
//
// Why this exists: every module used to read `process.env` at import time, which
// only worked because `require("dotenv").config()` happened to sit two lines
// above the first route `require()` in index.js. Reordering those lines would
// have silently made every JWT sign/verify use `undefined` as its secret.
// Requiring this module loads dotenv first, asserts the required vars are
// present, and fails at boot instead of failing quietly at request time.
require("dotenv").config();

// Vars the app cannot function without. PORT/NODE_ENV have safe defaults.
const REQUIRED_ENV_VARS = ["MONGO_URI", "JWT_SECRET_KEY"];

const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  // Throwing here crashes the process on startup by design: a server that
  // boots without a JWT secret would accept requests and mis-handle every
  // one of them, which is far worse than not booting at all.
  throw new Error(
    `Missing required environment variable(s): ${missing.join(", ")}. ` +
      `Add them to the root .env file before starting the server.`
  );
}

const env = process.env.NODE_ENV || "development";

// "Production-like" covers both production and staging, which the original code
// checked as a two-way OR in three separate places. Computed once here instead.
const isProdLike = env === "production" || env === "staging";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

const config = Object.freeze({
  env,
  isProdLike,
  port: Number(process.env.PORT) || 8000,

  db: Object.freeze({
    uri: process.env.MONGO_URI,
    // Was hardcoded inline in index.js's connect() call.
    name: "raahi-beats-mern",
  }),

  jwt: Object.freeze({
    secret: process.env.JWT_SECRET_KEY,
    // Tokens previously had no expiry at all, so any leaked token stayed valid
    // forever. Matched to the auth cookie's lifetime so the two agree.
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  }),

  cookie: Object.freeze({
    // maxAge (a relative duration) rather than an absolute `expires` date:
    // the previous module-level `expires: new Date(Date.now() + 24h)` was
    // evaluated once at boot, so a server up for more than a day handed out
    // already-expired cookies and users could never stay logged in.
    maxAgeMs: ONE_DAY_IN_MS,
    // Cross-site cookies require SameSite=None, which browsers only honour on
    // Secure connections — so both flags move together with the environment.
    secure: isProdLike,
    sameSite: isProdLike ? "none" : "lax",
  }),
});

module.exports = config;

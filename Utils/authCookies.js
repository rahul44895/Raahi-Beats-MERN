const config = require("../config");

// Builds the cookie attributes fresh on every response.
//
// Why a function and not a shared object: the original `cookieOptions` was a
// module-level const whose `expires: new Date(Date.now() + 24h)` was evaluated
// once, when the module was first required at server boot. Any server up longer
// than a day then issued cookies with a past expiry — login returned
// success: true but the browser discarded the cookie, so the user was never
// really logged in. `maxAge` is relative and applied by the browser, so it
// cannot go stale no matter how long the process lives.
const buildCookieOptions = () => ({
  maxAge: config.cookie.maxAgeMs,
  // NOTE: intentionally left false for now. Four client files read this cookie
  // from JavaScript (Cookies.get("token") in SongState/ProtectedRoute/ChatApp,
  // Cookies.get("user") in Navbar), so flipping it to true server-side would
  // break authentication until the frontend moves to reading auth state from an
  // endpoint instead. Tracked as #4b in docs/backend-optimization-backlog.md.
  httpOnly: false,
  secure: config.cookie.secure,
  sameSite: config.cookie.sameSite,
});

// The JWT the API authenticates with.
const TOKEN_COOKIE = "token";
// A separate, deliberately readable cookie holding display-only fields, so the
// client can render the current user without an extra request.
const USER_COOKIE = "user";

const setAuthCookies = (res, { token, user }) => {
  const options = buildCookieOptions();
  res.cookie(TOKEN_COOKIE, token, options);
  res.cookie(
    USER_COOKIE,
    JSON.stringify({ username: user.username, avatar: user.avatar }),
    options
  );
};

const clearAuthCookies = (res) => {
  // A browser only clears a cookie when the attributes match those it was set
  // with. The old logout called res.clearCookie("token") with no options at
  // all, so in production — where the cookie carries secure + sameSite=none —
  // the credential was frequently left in place while the response still
  // reported a successful logout. Reusing the same builder keeps the two in
  // sync by construction rather than by remembering to update both.
  const { maxAge, ...clearOptions } = buildCookieOptions();
  res.clearCookie(TOKEN_COOKIE, clearOptions);
  res.clearCookie(USER_COOKIE, clearOptions);
};

module.exports = { setAuthCookies, clearAuthCookies };

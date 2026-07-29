# Backend architecture & optimization backlog

## Context

Companion to `docs/frontend-optimization-backlog.md`. Rahul asked for the same treatment on the server side: a full read of the backend (`index.js`, `routes/`, `models/`, `middlewares/`, `websocket/`, `Utils/`) covering architecture, folder/code structure, optimization opportunities, how many services it actually provides, where SOLID principles could apply, and what gaps need filling.

Like the frontend doc, **this is an inventory to pick from, not a single change to implement.** The workflow is: review the list, pick one item (or a small cluster), implement it as its own scoped task with its own verification, and check it off here with a `~~strikethrough~~` and commit hash.

Findings are deduplicated against `CLAUDE.md`'s "Known Issues / Refactor Backlog" section — where an item already appears there, it's cross-referenced rather than restated, and in a few cases **escalated** because the read turned up a worse severity than originally recorded.

Drafted 2026-07-29 from a full-backend read. Verify an item still applies before acting on it.

---

## 1. Architecture as it stands

### Request path

```
client (CRA, REACT_APP_HOST = "<origin>/api")
   │
   ▼
index.js
   ├─ mongoose.connect(...)            ← fire-and-forget, .catch(console.log)
   ├─ express.json()
   ├─ cookieParser()
   ├─ cors(hardcoded origin allowlist)
   ├─ setInterval self-ping (15 min)   ← keep-alive hack in app code
   ├─ POST /api/deviceDetails          ← inline handler, console.logs IP + body
   ├─ error-handling middleware        ← registered BEFORE routes ⇒ catches nothing
   ├─ /api/uploads → express.static("uploads/")
   ├─ /api/users    → routes/UsersRoute.js
   ├─ /api/songs    → routes/SongsRoute.js
   ├─ /api/artists  → routes/ArtistsRoute.js
   ├─ /api/playlist → routes/PlaylistRoute.js
   ├─ /api/utils    → routes/UtilsRoute.js
   ├─ /api/chat     → routes/ChatsRoute.js
   ├─ chatWebsocket(server)            ← Socket.IO, namespace /api/chatnamespace
   ├─ if (NODE_ENV === production||staging) { }   ← empty block, dead
   ├─ express.static("client/build")   ← runs unconditionally
   └─ GET * → client/build/index.html  ← swallows unknown /api routes as HTML
```

### Layering

There is **one layer**. Every route handler is simultaneously the controller (parses `req`), the validator (inline `if`/regex), the service (business rules), the repository (Mongoose queries), the serializer (shapes the JSON), and the file-system janitor (`deleteFiles`). The README documents a `controllers/` folder that has never existed.

Consequences that show up concretely elsewhere in this document: nothing is unit-testable without booting Express and Mongo (§7), business rules are copy-pasted rather than shared (#21, #22), and response shapes drift per route because each handler invents its own (#27).

### Naming / structure inconsistencies

| Observed                                                                                                                                                                  | Problem                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `models/SongSchema.js` exports a **Model**, not a Schema; consumers then name the import `SongsSchema`                                                                    | The name lies twice over. `SongsSchema.find()` reads as if you're querying a schema.                                                                                                           |
| `Utils/` (capital U) vs `models/`, `routes/`, `middlewares/`, `scripts/`, `websocket/`                                                                                    | Case-sensitive on Linux (Render). Currently consistent at every call site, so it works — but it's a portability trap one careless `require("../utils/...")` away from a production-only crash. |
| `routes/ArtistsRoute.js`, `ChatsRoute.js` (plural) vs `SongsRoute.js`… actually also plural, vs `UsersRoute.js` plural, vs `PlaylistRoute.js`, `UtilsRoute.js` (singular) | Mixed plurality. Trivial, but it's the kind of thing a reviewer notices first.                                                                                                                 |
| `models/ContactsSchema.js` → `mongoose.model("Contact", …)`; `ChatSchema.js` → `"Chat"`                                                                                   | Model names singular, file names plural. Combined with the `ref` mismatches (#21, and `CLAUDE.md`'s ref-mismatch item) this is why nothing can `populate()`.                                   |
| No `config/`, no `services/`, no `controllers/`, no `repositories/`, no `validators/`, no `errors/`, no `tests/`                                                          | The whole missing middle of the app.                                                                                                                                                           |

---

## 2. Services inventory — how many services does this actually provide?

**Nine real service domains, plus two pseudo-domains**, spread across six route files with no 1:1 mapping between "domain" and "file".

| #   | Service domain                                                           | Lives in                                                                                                        | Notes                                                                                                                            |
| --- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Identity & auth** — signup, login, logout, JWT issuance                | `routes/UsersRoute.js`, `middlewares/decodeToken.js`                                                            | Also owns avatar upload as a side effect of signup.                                                                              |
| 2   | **Song catalogue** — create, delete, search, update metadata             | `routes/SongsRoute.js`                                                                                          |                                                                                                                                  |
| 3   | **Discovery feeds** — new releases, 20+-year-old songs, top-scored songs | `routes/SongsRoute.js`                                                                                          | Same file as #2 but a genuinely separate concern: read-only, cacheable, identical for all anonymous users.                       |
| 4   | **Artist catalogue** — create, search, artist detail w/ songs            | `routes/ArtistsRoute.js`                                                                                        |                                                                                                                                  |
| 5   | **Engagement** — play counts, likes, per-user favourites                 | `PUT /songs/update/playnlikes` (one handler)                                                                    | One endpoint mutates 3 collections (Song, Artist, User) for 3 different verbs. The single biggest SRP violation in the codebase. |
| 6   | **Playlists** — CRUD, song add/remove, reorder, public/private           | `routes/PlaylistRoute.js`                                                                                       | The only domain with consistent ownership checks.                                                                                |
| 7   | **Media storage** — upload, on-disk layout, static serving, cleanup      | `middlewares/multer.js`, `middlewares/UserFileUpload.js`, `Utils/DeleteFile.js`, `express.static` in `index.js` | Storage backend is hardcoded to local disk in three places.                                                                      |
| 8   | **Share / short links** — slug generation for songs & artists            | `routes/UtilsRoute.js`                                                                                          |                                                                                                                                  |
| 9   | **Chat** — contacts CRUD, message history, live delivery                 | `routes/ChatsRoute.js` + `websocket/chatWebsocket.js`                                                           | Split across two paradigms (REST reads, WS writes) sharing one schema.                                                           |
| —   | _Telemetry_ (`POST /api/deviceDetails`)                                  | inline in `index.js`                                                                                            | Not a service, a `console.log`. See #5.                                                                                          |
| —   | _Admin / data migrations_                                                | scattered across `SongsRoute`, `ArtistsRoute`, `UtilsRoute`                                                     | HTTP endpoints doing one-off backfills. See §3.                                                                                  |

**Takeaway for restructuring:** if/when the layering work in #21 happens, the service boundaries are _not_ the current file boundaries. `SongsRoute.js` alone contains three of them (#2, #3, #5).

---

## 3. Endpoint inventory — consumed vs. orphaned

Cross-referenced all 30 backend routes against every `${host}/…` call in `client/src`. **Nine of the 30 are unreachable from the app** — and eight of those nine are both unauthenticated and destructive.

### Consumed by the client (21)

`POST /users/signup` · `POST /users/login` · `GET /users/logout` · `POST /songs` · `POST /songs/get/newrelease` · `POST /songs/get/oldsongs` · `POST /songs/likedSongs` · `PUT /songs/update` · `PUT /songs/update/playnlikes` · `POST /artists/` · `POST /playlist/{add,get/public,get/private,update,delete,update/song}` · `POST /utils/share-link` · `GET /chat/get` · `POST /chat/add` · `POST /chat/get/messages` · `POST /deviceDetails`

### Orphaned — no client call site (9)

| Endpoint                            | Auth          | Blast radius if hit by a stranger                                                                         |
| ----------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------- |
| `POST /songs/add`                   | **none**      | Writes arbitrary files to disk + DB rows.                                                                 |
| `DELETE /songs/delete`              | **none**      | Deletes any song **and `rm -rf`s its parent directory** (`fs.rm(recursive, force)`).                      |
| `PUT /songs/update/songs/artists`   | **none**      | Full-collection rewrite; creates Artist docs. No `try/catch`.                                             |
| `POST /artists/add`                 | **none**      | Writes files + rewrites every Song's artist array.                                                        |
| `PUT /artists/update/artists/songs` | **none**      | Full-collection rewrite. Contains a guaranteed `ReferenceError` (see #2).                                 |
| `DELETE /artists/delete/songs`      | **none**      | **Wipes `songs: []` on every artist document in the database.** No `try/catch`, no confirmation, no undo. |
| `POST /utils/short-link/songs`      | **none**      | Regenerates `shortenURL` for **every** song — instantly breaks every share link ever handed out.          |
| `GET /utils/short-link/artists`     | **none**      | Same, for artists. **`GET`**, so a crawler, a prefetcher, or an `<img src>` can trigger it.               |
| `DELETE /chat/delete`               | `decodeToken` | Fine — properly authed and ownership-checked. Just unused.                                                |

The last one is the only benign entry. The other eight are the highest-priority items in this document (§4.1 #1).

---

## 4. The backlog

### 4.0 Progress log

**2026-07-29 — user domain extracted into layers** (commit `55f5787`). `routes/UsersRoute.js` went from a 184-line single-layer file to 30 lines of wiring, split into `controllers/user.controller.js` → `services/user.service.js` → `repositories/user.repository.js`, with `validators/user.validator.js` for input rules. Shared infrastructure introduced alongside it, reusable by the remaining five routers: `config/index.js` (#23), `errors/AppError.js`, `middlewares/asyncHandler.js` (#3), `middlewares/errorHandler.js` (#9), `Utils/authCookies.js`, `Utils/fileCleanup.js`.

Items **fully closed** by that work: #4 (JWT expiry), #7 (clearCookie attributes), #19 (login enumeration) — all three only ever applied to `UsersRoute.js`. Plus one bug not previously in this document:

- ~~**Auth cookies were issued with a boot-time `expires` date.**~~ **Fixed.** `cookieOptions` was a module-level `const` whose `expires: new Date(Date.now() + 24h)` evaluated once, when the module was first required at server start. Any process alive longer than a day then set cookies with a past expiry: the browser discarded them, so `/login` answered `success: true` while the user was never actually logged in. Since the 15-minute self-ping (#29) keeps Render alive indefinitely, this was live in production. Now uses `maxAge`, which the browser applies relative to receipt and so cannot go stale.

Items **advanced but not closed** — the pattern exists and is proven on one domain, five routers still to migrate: #3, #9, #13, #18, #23, #26, #27, #30.

Still **explicitly open** and deliberately excluded from that pass:

- **#4b (`httpOnly: true`) is blocked on frontend work.** Four client files read the cookie from JavaScript — `Cookies.get("token")` in `SongState.js`, `ProtectedRoute.jsx`, and `ChatApp.jsx` (×2), `Cookies.get("user")` in `Navbar.jsx`. Flipping the flag server-side alone would break authentication. Needs a paired change moving the client to read auth state from an endpoint.
- **Case-insensitive email.** `EMAIL_PATTERN` permits `[a-zA-Z]`, so mixed-case addresses already exist in the database. Normalizing to lowercase would stop matching those accounts and lock those users out, so `validators/user.validator.js` trims but deliberately does not change case. Fixing this properly needs a one-off migration plus a collation-aware unique index — worth a task of its own.
- **#15 (`Utils/DeleteFile.js`'s `else if` chain)** is unfixed. `Utils/fileCleanup.js` implements the correct field-agnostic behaviour, but only the user domain uses it; the song/artist routes still call the old helper and still orphan audio files. Merge the two when `SongsRoute` is migrated.

### 4.1 Tier 0 — crash vectors & security (do these first)

1. **Lock down or delete the eight unauthenticated write endpoints in §3.**
   `UserSchema` already has `role: { enum: ["user","admin"], default: "user" }` — **and nothing in the codebase ever reads it.** The field was added and forgotten. Fix is two-part: (a) add a `requireRole("admin")` middleware that builds on `decodeToken`; (b) move the four _migration_ endpoints (`songs/update/songs/artists`, `artists/update/artists/songs`, `artists/delete/songs`, `utils/short-link/*`) out of the HTTP surface entirely into `scripts/` CLI one-offs — they are backfills, not API operations, and `GET /utils/short-link/artists` being a `GET` means it is one prefetch away from destroying every share link in production.
   _Broader than `CLAUDE.md`'s existing "SongsRoute and ArtistsRoute add/delete have no auth" line — that entry undercounts by six endpoints and misses the `GET`-triggers-destruction case._

2. **Fix the guaranteed `ReferenceError` in `ArtistsRoute.js:177`.** The `else` branch of `PUT /update/artists/songs` references `newSong._id` — a variable that does not exist in that scope or any enclosing one. Any request reaching that branch (artist `_id` embedded in a song but no matching Artist doc) throws. Currently masked only by the endpoint being orphaned.

3. **Add `try/catch` to the three handlers that have none — this is a remote crash, not a 500.** `POST /songs` (`SongsRoute.js:129`), `PUT /songs/update/songs/artists` (`SongsRoute.js:492`), and `DELETE /artists/delete/songs` (`ArtistsRoute.js:192`). Express 4 does not catch async handler rejections, and Node ≥15 terminates the process on an unhandled rejection by default. So `POST /api/songs` with a malformed `userToken` — or a valid token for a since-deleted user, which makes `user.favourites` throw on `null` — **takes the whole server down**, dropping every active Socket.IO chat connection with it. One unauthenticated request, full outage.
   _`CLAUDE.md` records this as "will throw inside JWT.verify uncaught". Escalating: the consequence is process death, not a failed request._ The durable fix is an `asyncHandler` wrapper (or `express-async-errors`) applied uniformly, not three hand-written `try/catch` blocks.

4. **Give the JWT an expiry.** `JWT.sign({ userID: user._id }, JWT_SECRET_KEY)` in both `/signup` and `/login` sets no `expiresIn`, so every token ever issued is valid **forever**. The 24-hour `cookieOptions.expires` only controls how long the _browser_ volunteers to send it — a copied token never stops working. Add `expiresIn`, and pair with #4b.
   4b. **`httpOnly: false` on the `token` cookie** (already in `CLAUDE.md`) is what makes #4 exploitable: any XSS reads the token, and that token is then a permanent credential. These two are one task, not two.

5. **`POST /api/deviceDetails` is an open, unauthenticated, unbounded log-write endpoint.** It `console.log`s `req.ip` and the entire request body on every call. Three problems: it is a log-flooding / log-injection vector for anyone who finds it; it records user IPs (PII) with no retention policy or consent; and `req.ip` is wrong anyway because `app.set("trust proxy", …)` is never called, so behind Render's proxy every request logs the proxy's address. Decide whether this is a real telemetry feature (→ authenticate it, validate the body, rate-limit it, give it a real sink) or debug scaffolding (→ delete it, and the `App.js` call site).

6. **`app.set("trust proxy", 1)`.** Needed before _any_ IP-based rate limiting (#8) can work, and before `req.ip` or `secure`-cookie detection is trustworthy on Render. Cheap, and it unblocks other items.

7. **Fix `res.clearCookie` in `/logout`.** `res.clearCookie("token")` / `("user")` pass no options, but the cookies were _set_ with `secure: true, sameSite: "none"` in production. A browser will not clear a cookie whose attributes don't match, so **logout can silently fail in production while appearing to succeed** (the client-side state clears, the credential doesn't). Pass the same `cookieOptions` minus `expires`.

8. **Add `helmet`, `express-rate-limit`, and CSRF protection.** Already in `CLAUDE.md`; restating for ordering only — rate-limiting login is the single highest-value item here (`/login` is currently unlimited-attempt brute-forceable against bcrypt, which also makes it a cheap CPU-exhaustion vector). Depends on #6 to identify clients correctly.

9. **Move the error-handling middleware below the routes, and make handlers actually reach it.** Already in `CLAUDE.md`. Note the dependency: this is worth little until #3's `asyncHandler` exists, since without it rejections never reach `next(err)` at all. Do #3 first, then this, then delete the two dead per-router error middlewares in `UsersRoute.js:173` and `ChatsRoute.js:136`.

10. **Harden the chat websocket.** `chatWebsocket.js:34`'s `JWT.verify` sits outside any `try/catch` inside an `async` socket handler — an invalid token is an unhandled rejection, i.e. another process-kill path (same mechanism as #3). Alongside it: `contact.save()` at line 99 is **not awaited** (silent lost write + another unhandled-rejection source); there is **no `disconnect` handler at all**, so `ChatSchema.socketID` rows go stale forever and messages get emitted into dead socket IDs; and `data.receiverEmail` is never validated against a real user, so anyone can spray messages at arbitrary strings and create unbounded `ChatSchema` documents. Convert `register` into a proper `io.use()` handshake-auth middleware rather than a post-connection event.

### 4.2 Tier 1 — small, isolated, high-impact

11. **Replace read-modify-write counters with atomic `$inc`.** `PUT /songs/update/playnlikes` does `song.playCount += 1; await song.save()`, and the same for `artist.playedCount`, `artist.likedCount`, `user.plays`. Two listeners hitting play concurrently → one increment lost. This is the hottest write path in the app (fires on every play). `updateOne({_id}, {$inc: {playCount: 1}})` fixes it and removes a full document read+write per call.

12. **Make liking idempotent.** Same handler: `song.likes += likeCount` is a separate non-atomic step from the `favourites.push`, with a `.some()` guard on the array but none on the counter — so a double-click increments `likes` twice while adding one favourite. Use `$addToSet` / `$pull` on `favourites` and derive or guard `likes` from the actual result. Ties to #11; likely the same task.

13. **Swap `JSON.parse(JSON.stringify(doc))` for `.lean()`.** In `CLAUDE.md` as "pervasive". Concrete count: **13 occurrences** — `SongsRoute` 6, `PlaylistRoute` 4, `ArtistsRoute` 3 (two of them inside a `Promise.all` map, i.e. once per song). `.lean()` skips Mongoose document hydration entirely rather than building full documents and then throwing them away — cheaper on both CPU and allocation. Mechanical, safe, testable one file at a time.

14. **Delete the dead code.** `allSongs()` (`SongsRoute.js:521`) is defined and only referenced from a commented-out call. The empty `if (NODE_ENV === "production" || "staging") { }` block (`index.js:78-82`) — decide whether the two `express.static`/`app.get("*")` lines below it were meant to be _inside_ it. `PlaylistSchema.js:28-43`'s commented-out embedded-song fields. `chatWebsocket.js:127-132`'s commented offline-notice block.

15. **Fix the `else if` bug in `Utils/DeleteFile.js`.** `deleteFiles` chains `if (coverImage) … else if (filePath) … else if (artistImage)`. `POST /songs/add` uploads **both** `coverImage` and `filePath`; on failure only the cover image is deleted and the (much larger) audio file is orphaned on disk permanently. Should be three independent `if`s — or better, iterate `Object.values(files).flat()` and stop enumerating field names at all.

16. **Add the missing indexes.** Queried-but-unindexed fields: `SongSchema.shortenURL` (exact-match lookup at `SongsRoute.js:143` — the share-link resolution path), `ArtistSchema.name` and `ArtistSchema.shortenURL` (nothing on that schema is indexed at all), `PlaylistSchema.user` and `.public` (every playlist read filters on one or both), `ContactsSchema.user` (every contacts read). Also: `SongSchema.artists.name` is regex-searched and cannot use a b-tree index regardless — that one needs a text index or a different search strategy (#22).

17. **Fix the `POST /artists/` response-shape switch.** When the query matches exactly one artist, the handler returns `artists` as a **single object**; otherwise an **array** (`ArtistsRoute.js:116-119`). The same field, two types, decided by result count. This is why the frontend needed array-vs-single-object branching (see the frontend backlog #12, which collapsed the _client_ side of it — the server still emits both shapes). Always return an array; adjust the one or two call sites.

18. **Fix the signup validation order.** `username.length`, `email.match`, `password.match` are called before any existence check, so `POST /users/signup` with a missing field throws `TypeError: Cannot read properties of undefined` → caught → **500 with a "please retry" message for what is plainly a 400 client error**. Related, same handler: the duplicate-email lookup happens _after_ `bcrypt.hashSync` (10 salt rounds of CPU burned to then reject the request), and a race past that check surfaces as a raw Mongo `E11000` → generic 500 rather than the intended 409.

19. **Stop leaking account existence at `/login`.** `404 "User not found."` vs `400 "Password is incorrect."` lets anyone enumerate which emails are registered. Return one indistinguishable `401` for both. (Skipping bcrypt entirely when the user is missing also leaks the same information via response timing — compare against a dummy hash.)

20. **Add pagination and hard result caps.** `POST /songs` and `POST /artists/` both run an unbounded `find()` and serialize the entire collection; `POST /utils/short-link/songs` loads every song and saves each one in a sequential loop. Fine at college-project scale, a cliff at any other. Add `limit`/`skip` with a server-enforced maximum.

### 4.3 Tier 2 — medium effort, mostly mechanical

21. **Kill the N+1 artist lookups.** The exact same block —

    ```js
    currSong.artists = await Promise.all(
      currSong.artists.map(async (a) => ArtistSchema.findById(a._id))
    );
    ```

    — appears **five times** (`SongsRoute.js` ×4, `ArtistsRoute.js` ×1, plus a nested variant inside `ArtistsRoute`'s single-artist branch that is N+1 _within_ an N+1). For a 50-song response with 2 artists each that's 100 round trips to Mongo to rebuild data that could be one `$in` query, or zero queries if the embedded `{_id, name}` pairs were trusted (they exist precisely so this wouldn't be necessary), or a `populate()` if the `ref` names weren't broken (`ArtistSchema.songs` refs `"Songs"` but the model is `"Song"` — see `CLAUDE.md`'s ref-mismatch item). Recommended order: fix the `ref` names first, then decide between `populate()` and a single batched `$in` + in-memory map.

22. **Extract the duplicated "liked status" enrichment.** Verbatim in `SongsRoute.js` ×4 and `PlaylistRoute.js` ×2 — decode `userToken`, `findById` the user, `.some()` over `favourites`. `POST /songs/likedSongs` does the _whole thing twice in one handler_ (lines 325 and 350), including two identical `JWT.verify` + `findById` calls for the same user in the same request. Extract to one `enrichWithLikes(docs, userId)` helper. `CLAUDE.md` lists this as duplication between two routes; the real count is six sites.

23. **Introduce a config module with fail-fast validation.** `process.env.JWT_SECRET_KEY` is read at _module load_ in `SongsRoute`, `PlaylistRoute`, `decodeToken`, and `chatWebsocket` — which works today only because `require("dotenv").config()` happens to sit on `index.js:5`, two lines above the first route `require`. Reorder those two lines and every JWT operation silently starts signing with `undefined`. A `config/index.js` that loads dotenv, asserts `MONGO_URI` / `JWT_SECRET_KEY` / `PORT` are present, throws at boot if not, and exports frozen values removes both the ordering hazard and the "server runs, auth is broken" failure mode. Also the natural home for the CORS allowlist (#24) and the hardcoded `raahi-beats-mern` DB name.

24. **Consolidate the CORS allowlist.** Two hardcoded lists — `index.js:20-29` and `chatWebsocket.js:11-21` — that have **already drifted** (`http://192.168.1.6:3000` and `192.168.29.135:3000` appear in one but only the former in the other). Both contain personal LAN IPs. Move to config (#23), read from env.

25. **Add structured logging.** **44** raw `console.log`/`console.error` calls across the backend, with no request correlation, no levels, and several logging full error objects next to user data (`PlaylistRoute.js:219` logs `{user: req.user, error}`). `pino` + a request-id middleware. Note `PlaylistRoute.js:52`'s bare `console.log(query)` on every private-playlist read, and `PlaylistRoute.js:150`'s `console.log("Given Playlist count is less than the actual one.")` — that one is swallowing what should be a 400.

26. **Introduce a validation layer.** Every handler validates by hand: inline regexes, `if (!x) return res.status(400)`, and `PlaylistRoute.js:16`'s `for (let [key, value] of Object.entries(requiredFields))` loop — an ad-hoc validator implemented once, for one route. Adopt `zod` (or `express-validator`) and declare schemas per endpoint. Prerequisite for #18 and for consistent error shapes (#27).

27. **Normalize response shapes.** Currently four different conventions coexist: `{success, error}`, `{success, message}`, `{error}` alone (`PlaylistRoute.js:131`), `{message, playlist}` with no `success` (`PlaylistRoute.js:180`), and `res.send(artists)` returning a bare array (`ArtistsRoute.js:198`). `POST /artists/add` even returns **`201` with `success: false`** for a duplicate. Pick one envelope, define an `AppError` class with a status code, and let the (now-reachable, #9) central error handler do the formatting.

28. **Convert the mutating reads from `POST` to `GET`.** `POST /songs`, `POST /songs/get/newrelease`, `POST /songs/get/oldsongs`, `POST /songs/likedSongs`, `POST /artists/`, `POST /playlist/get/*` are all pure reads sent as `POST` — because they pass `userToken` in the _body_. The token is already in an httpOnly-able cookie; `decodeToken` (or the optional variant from §6/ISP) can read it from there, freeing these to be `GET`s that browsers, CDNs, and `ETag`/`Cache-Control` can actually cache (#30). Touches the frontend too, so it's a coordinated change.

29. **Add a real health endpoint and fix the self-ping.** The `setInterval` keep-alive (`index.js:35`) hits `/`, which serves `index.html` — it proves nothing about Mongo or the app. Add `GET /api/health` that checks `mongoose.connection.readyState`, and move the keep-alive out of application code into an external cron/uptime monitor (already flagged in `CLAUDE.md` as a hosting hack baked into app code). Note it also currently pings the **hardcoded production URL from every environment**, including localhost.

### 4.4 Tier 3 — structural, needs design first

30. **Introduce controller → service → repository layering.** The headline item, and the one everything in §6 depends on. Suggested shape, one domain at a time (start with Playlists — smallest, cleanest, already has ownership checks):

    ```
    routes/playlist.routes.js        → HTTP wiring + validation middleware only
    controllers/playlist.controller  → req/res translation, no business logic
    services/playlist.service.js     → rules, ownership, orchestration
    repositories/playlist.repo.js    → all Mongoose calls, returns plain objects
    ```

    Do **not** attempt all six domains in one pass. Each domain migrated is independently valuable, and the first one establishes the pattern for the rest.

31. **Add caching to the discovery feeds.** `newrelease`, `oldsongs`, and `likedSongs`' anonymous half return byte-identical payloads to every unauthenticated caller, recomputed (with the N+1 from #21) on every single request. An in-process TTL cache is a ~15-line change with a large payoff; `Cache-Control` + `ETag` is better still but needs #28 first.

32. **Move media off the local disk.** `uploads/` on Render is an **ephemeral filesystem — every redeploy wipes every user avatar and every uploaded song.** The 252 committed binaries in git (`CLAUDE.md`, repo hygiene) are effectively the only reason the app still has content. This is the one item on this list that is losing data today. Design work needed: pick a store (S3/R2/Cloudinary), define a `StorageAdapter` interface (§6 DIP), migrate existing files, keep the DB storing keys rather than paths. Related smaller cleanup: the backend writes **Windows-style backslash paths** into `filePath`, which is why `AudioState.js` has to `.replace(/\\/g, "/")` on the client and why `SongsRoute.js:282` does `filePath.lastIndexOf("\\")` — a `path.posix` normalization at write time fixes both ends. Also add `Cache-Control: max-age` to the `express.static` mount (audio is currently re-validated on every play) and `express.static`'s `fallthrough: false` so a missing file 404s as JSON instead of falling through to the SPA catch-all.

33. **Redesign chat persistence.** Every message is written **twice** — once into the sender's `ChatSchema` doc and once into the receiver's (`chatWebsocket.js:71-125`) — as an unbounded array inside a single document. Two consequences: storage doubles and the two copies can silently diverge (only one of the two writes is awaited, #10); and each doc grows without limit toward the **16 MB BSON ceiling**, at which point that user's chat simply stops working forever. Compounding it, `POST /chat/get/messages` loads a user's _entire_ message array into memory and filters in JS, with no pagination. Correct shape is a separate `Message` collection with `{conversationId, senderId, body, createdAt}`, indexed on `{conversationId, createdAt}`, paginated. `CLAUDE.md` warns to read `ChatsRoute.js` and `chatWebsocket.js` together before touching this — that warning stands; this is the highest-risk item in the document.

34. **Add a test suite and CI.** Zero tests today; both `package.json`s have placeholder `test` scripts. Recommended entry point: `jest` + `supertest` + `mongodb-memory-server`, and write the _first_ tests as regression tests for Tier 0 — e.g. "`POST /api/songs` with a garbage `userToken` returns 400 and the process survives" (#3), "logout clears the cookie with production attributes" (#7), "`playnlikes` under 10 concurrent calls increments exactly 10" (#11). That way the test suite arrives already earning its keep. Then a GitHub Actions workflow running `prettier --check` + tests on PR.

---

## 5. Optimization summary (quick reference)

Ordered by expected payoff per hour of work:

| Change                            | Item | Why it pays                                                         |
| --------------------------------- | ---- | ------------------------------------------------------------------- |
| Atomic `$inc` on counters         | #11  | Removes a read+write per play; fixes lost updates                   |
| Batch the artist N+1              | #21  | 100 queries → 1 on a typical song list                              |
| Add missing indexes               | #16  | Collection scans → index seeks on the share-link and playlist paths |
| Cache the discovery feeds         | #31  | Eliminates repeated identical work incl. #21's cost                 |
| `.lean()` everywhere              | #13  | Drops Mongoose hydration on every list response                     |
| Pagination / result caps          | #20  | Bounds worst-case payload and memory                                |
| `compression` middleware          | —    | Not installed; JSON song lists compress well. One line.             |
| `Cache-Control` on `/api/uploads` | #32  | Audio and cover art currently revalidate on every play              |
| Reads as `GET`                    | #28  | Unlocks browser/CDN caching at all                                  |

---

## 6. SOLID — at what stages can each principle apply?

These are not abstract; each maps to a specific stage of the refactor and a specific piece of current code.

### S — Single Responsibility → _stage: the layering split (#30)_

The clearest violation is `PUT /songs/update/playnlikes`: one endpoint that increments a song's play count, increments every artist's play count, increments the user's play count, adds/removes a favourite, and adjusts a like counter — mutating three collections for three different verbs, with the verb selected by which body fields happen to be present. Split into `recordPlay(songId, userId)` and `setLike(songId, userId, liked)` as separate service methods behind separate endpoints. Secondary violations: `POST /users/signup` also owns avatar file upload and cleanup; `SongsRoute.js` holds three of the nine service domains from §2.

### O — Open/Closed → _stage: extracting the enrichers (#22)_

`UserSchema.favourites` already supports `category: ["Artist", "Song"]`, but every one of the six liked-status blocks hardcodes `category === "Song"`. Shipping "liked artists" means editing six copy-pasted blocks and hoping none were missed. A single `enrichWithLikes(docs, userId, category)` makes that feature an argument, not an edit. Same pattern for the two `score`-computing aggregations (`SongsRoute.js:311`, `ArtistsRoute.js:95`) with their magic weights `0.4/0.6` and `0.5/0.5` inline — a named, configurable ranking function would make tuning a config change.

### L — Liskov Substitution → _stage: response normalization (#17, #27)_

In plain JS this applies to **interface contracts** rather than class hierarchies, and the violation is real: `POST /artists/` returns `artists` as an array — except when exactly one matches, where it returns a bare object. Any client written against the contract breaks on the special case; the frontend carries branching code purely to absorb it. Same class of problem: `POST /artists/add` returning `201` with `success: false`, and `DELETE /artists/delete/songs` returning a bare array via `res.send()` while every sibling returns an envelope. A caller should never have to inspect the response to learn its shape.

### I — Interface Segregation → _stage: the auth middleware rework (#4, #28)_

`decodeToken` is a single fat interface: it _demands_ a token and 401s without one. But half the app needs only _optional_ identity — "tell me if this song is liked, if you happen to know who's asking." Because the fat interface can't express that, four handlers bypass middleware entirely and re-implement JWT decoding inline against `req.body.userToken`, which is exactly the code path that crashes the server (#3) and forces reads to be `POST`s (#28). Segregate into `requireAuth` (401s) and `attachUser` (never fails, sets `req.user` or leaves it undefined), and add `requireRole("admin")` for #1. This single change dissolves four separate problems on this list — probably the highest-leverage SOLID application here.

### D — Dependency Inversion → _stage: repositories (#30) and the storage adapter (#32)_

Three concrete dependencies are nailed directly into business logic:

- **Persistence:** handlers `require` Mongoose models and call `.find()`/`.save()` inline. Nothing can be tested without a live Mongo. → repository interfaces returning plain objects.
- **Storage:** the local-disk assumption is hardcoded in `multer.js`, `UserFileUpload.js`, and `Utils/DeleteFile.js`. → a `StorageAdapter` with `save`/`delete`/`getUrl`, implemented as `DiskStorage` today and `S3Storage` later, which is what makes #32 a swap rather than a rewrite.
- **Configuration:** `process.env` read at module scope in five files. → inject the config object (#23).

**Suggested sequence** (each stage enables the next): `attachUser`/`requireAuth` split (I) → config injection (D) → enricher extraction (O) → response normalization (L) → layering + repositories (D, S) → storage adapter (D).

---

## 7. Gaps that need filling

Things that don't exist at all, roughly by how much their absence costs:

**Correctness & safety**

- No tests, no CI (#34). No way to verify any item on this list didn't break something.
- No input validation library (#26). No output serialization layer either — Mongoose docs are `JSON.stringify`ed straight to the wire, which is why `POST /songs/likedSongs` and friends leak whatever fields the schema happens to have.
- No transactions anywhere, despite multi-collection writes in `playnlikes` and `songs/add` that can half-succeed and leave orphaned files or inconsistent counters.
- No graceful shutdown. `SIGTERM` on a Render redeploy kills in-flight requests and open sockets mid-write.
- No DB connection failure handling: `.catch(error => console.log(error))` and the server **starts listening anyway** — it will happily serve 500s with no indication the database was never reachable.

**Operability**

- No structured logging, no request IDs, no error tracking (#25). Debugging a production report means guessing.
- No health/readiness endpoint (#29).
- No `.env.example`, so onboarding requires reading `CLAUDE.md` to discover the four required variables.
- No `engines` field pinning a Node version; no Dockerfile / reproducible runtime.
- No metrics, no APM.

**API surface**

- No API documentation of any kind (no OpenAPI/Swagger, no route table in the README — and the README's documented folder structure describes a `controllers/` directory that has never existed).
- No versioning (`/api/v1`). Any breaking change breaks all deployed clients simultaneously.
- No consistent 404 for unknown API routes — `app.get("*")` returns `index.html` with a `200` for a typo'd endpoint, so client-side fetch errors surface as JSON parse failures rather than 404s.
- No pagination contract (#20).

**Product/domain gaps the schemas imply but no code delivers**

- `UserSchema.role` exists, is never checked (#1).
- `SongSchema.comments[]` and `SongSchema.ratings[]` are fully modelled with sub-schemas, but the only code that touches either is the orphaned `POST /songs/add` passing them straight through from the request body (`SongsRoute.js:76-77`) — **nothing ever reads them, and no endpoint can add a comment or a rating to an existing song.** Dead schema, or unfinished features.
- No password reset, no email verification, no session revocation (which #4's forever-tokens make worse — there is no way to invalidate a leaked credential).
- Avatar upload is _mandatory_ at signup (`UsersRoute.js:75`), a hard blocker with no default-avatar fallback.
- No soft deletes or audit trail; `DELETE /songs/delete` unlinks a directory tree with no recovery path.

**Dependency hygiene**

- `mongodb` (`^6.8.0`) is a direct dependency alongside `mongoose`, which bundles its own driver — redundant, removable.
- `shortid` is deprecated upstream (already in `CLAUDE.md`) → `nanoid`.
- `multer@1.x` is no longer maintained → `multer@2.x`.
- `uuid` is used for exactly one thing (chat message ids, `chatWebsocket.js:137`) → `crypto.randomUUID()`, one fewer dependency.
- No `npm audit` in any workflow.

---

## 8. How to use this document

Same protocol as the frontend backlog. Pick one numbered item, or a small cluster where the dependency is called out — good natural pairings:

- **#3 + #9** — `asyncHandler` and the error middleware are one coherent change; #9 does little without #3.
- **#4 + #4b** — token expiry and `httpOnly` are one security fix, not two.
- **#11 + #12** — both live in `playnlikes` and both are atomicity fixes.
- **#6 + #8** — `trust proxy` is a prerequisite for working rate limits.
- **#1 + the ISP work in §6** — `requireRole` and the `requireAuth`/`attachUser` split are the same middleware rework.
- **#23 + #24** — the CORS lists are the first thing the new config module should own.

**Suggested starting point: #1 and #3.** They are the two items where the current behaviour is "a stranger with `curl` can destroy your data or take the server down," they're both small, and #3 pairs naturally with writing the first-ever test (#34) to prove the crash is gone.

Each item gets its own scoped plan and verification pass when picked — this document is deliberately not an implementation plan for everything at once. Mark items done here with a `~~strikethrough~~` and commit hash as they land.

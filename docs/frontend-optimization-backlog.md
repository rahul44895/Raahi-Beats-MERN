# Frontend smoothness & optimization backlog

## Context

Rahul (revisiting his college-era MERN project to bring it up to industry standard) asked for a full pass over `client/src` to list every modification that would make the app feel smoother/more optimized — a deliberate broadening of the same class of problem as the Seekbar fix (isolating re-renders, cutting unnecessary polling — see `client/src/Components/ControlArea/Seekbar.jsx`). This document is **an inventory to pick from**, not a single change to implement: the workflow is to review this list, pick one item (or a small cluster), implement it as its own scoped task with its own verification, and check it off here.

Three parallel audits were run (re-render/memoization, expensive-work/effect-hygiene, asset/CSS performance) covering every Context provider and every page/list component. Findings are deduplicated against `CLAUDE.md`'s backlog.

Originally drafted as a Claude Code plan-mode file; moved into the repo so progress is tracked alongside the code instead of in a local-only, non-versioned location.

## Tier 1 — small, isolated, high-impact (good next "one task" candidates)

1. ~~Memoize `PlaylistState.js` and `ShareState.js` context values~~ **Done**: Provider `value` wrapped in `useMemo` in both files, `handleshowPlaylistDialogue` (Playlist) and `share` (Share) wrapped in `useCallback`. All other exported functions in both files were already `useCallback`'d.
2. ~~Memoize `AlertState.js`'s context value~~ **Done**: `value={{ showAlert }}` now wrapped in `useMemo(() => ({ showAlert }), [showAlert])`; `hideAlert` (only used as a prop to the conditionally-rendered `AlertBox`, not part of the context value itself) wrapped in `useCallback` for consistency.
3. ~~Fix `Navbar.jsx`'s scroll listener~~ **Done** (commit `b8c9d66`): the handler is now named and gated behind `requestAnimationFrame` (via a `ticking` flag) instead of running unthrottled on every scroll pixel, and the effect now returns a proper `removeEventListener` cleanup, fixing the previous listener leak on remount.
4. ~~Fix `App.js`'s resize handler~~ **Done**: applied the same `ticking`/`requestAnimationFrame`-gating pattern used for the Navbar scroll fix — the 3 `setState` calls now run at most once per animation frame instead of once per native resize event.
5. ~~Fix `AlertBox.jsx`'s missing `setTimeout` cleanup~~ **Done** (commit `b8c9d66`): both timeout IDs are now stored and cleared in the effect's cleanup function, so an alert dismissed early (or a route change) no longer leaves a dangling timer that fires against an unmounted component. Added `?.` on the ref access as an extra safety net.
6. ~~Avoid the deep-clone hack on the hot playback path~~ **Done**: `play()` in `AudioState.js` now builds `song` via `{...tempSong, filePath: ..., coverImage: ...}` instead of `JSON.parse(JSON.stringify(tempSong))`.

## Tier 2 — medium effort, mostly mechanical

7. **Extract a shared `useNavbarHeight()` hook** to replace the ~12+ duplicated `document.querySelector(".navbar").offsetHeight` effects (already flagged in `CLAUDE.md`) — also covers `LoginPage.jsx:32`, `SignUp.jsx:37` (inline layout read every render), and the Home sections (`AllSongs.jsx:35` etc.).
8. **Extract a shared `useIsMobile()`/breakpoint hook** to replace the hardcoded `window.innerWidth < 1000` checks scattered across 5+ files — natural pair with #7 (same "duplicated responsive logic" cleanup).
9. **Fix `ChatApp.jsx`'s per-message layout read** (`ChatApp.jsx:88,107`): `chatAppContainer?.current?.offsetHeight` read inline in render for style calcs — since ChatApp re-renders on every incoming message, this forces a layout read per message, more impactful than the one-time reads in #7.
10. **Guard against redundant re-fetching on remount**: `AllSongs`, `NewReleases`, `OldReleases`, `UrbanPunjabiTadka`, `WestTunes` (Home sections) and `Artists.jsx` all unconditionally re-fetch their full data on every mount with no "already have it" check in the corresponding Context — causes an avoidable network round-trip and an empty-then-populated flash every time a user navigates away from and back to Home/Artists.
11. **`React.memo` pass on `SongCardXL`/`SongCardMedium`** plus removing the small per-item inline object literals that currently defeat memoization anyway (`Queue.jsx:89`'s `style={{ textWrap: "wrap" }}`, the `wrapperProps={{ style: {...} }}` passed to `LazyLoadImage` in both card components). Prerequisite (`Playlist`/`Share`/`Alert` context memoization, #1/#2) is now done, so this is unblocked.
12. **Extract a shared `ArtistCard` component** from the inline `.map()` markup currently duplicated between `Artists.jsx:79-107/120-150` and `SearchPage.jsx:87-115` — dedupes code and makes the cards memoizable, matching #11.
13. **Roll out `LazyLoadImage`** (already a dependency, already used for song cards) to the ~12 other image-bearing spots currently using plain `<img>`: artist avatars (`Artists.jsx`, `ParticularArtist.jsx`), queue/playlist-dialogue thumbnails, chat avatars, and the persistent bottom-player/fullscreen cover art. Bundle in explicit `width`/`height` attributes where missing (CLS risk is currently low since most containers have fixed CSS sizing, but not eliminated).

## Tier 3 — bigger, needs more design/testing before committing

14. **Route-level code splitting**: `App.js` has zero `React.lazy`/`Suspense` — all 13+ routes (including rarely-visited ones like `SignUp`, `LoginPage`, `ChatApp`) bundle eagerly into one chunk. Well-understood technique, meaningfully helps initial load, but touches the routing shell and needs a loading-fallback UI decision.
15. **Replace or lazy-load `react-beautiful-dnd`**: unmaintained upstream (already in `CLAUDE.md`'s backlog) and, per this audit, ships unconditionally in the main bundle via `Queue.jsx` → `FullScreen.jsx` → `App.js`'s eager import chain, regardless of whether a user ever opens the queue. Either lazy-load it (pairs with #14) or swap to a maintained fork (`@hello-pangea/dnd`) — a library swap needs deliberate behavior-parity testing, not a quick edit.
16. **Video asset handling**: `LikedSongsPage.jsx` imports **both** a 13.9MB and a 13.6MB background video and only picks one at mount by viewport width (the unused one still ships in the bundle); all three video-bearing pages (`HomePage`, `Artists`, `LikedSongsPage`) autoplay large `.mp4`s immediately with no `preload="metadata"`/`poster`. Fixing this properly (viewport-conditional dynamic import, poster frames, possibly re-encoding/compressing) is a meaningfully bigger, asset-pipeline-touching task — flagging for a dedicated session rather than a quick fix.
17. **`FullScreen`'s open-transition jank**: the `@keyframes fullscreen-entry-anime` (`FullScreenStyle.css:19-32`) animates non-compositor properties (`border-*-radius`, `top`) alongside a `transform: scale`, at the same time as a `backdrop-filter: blur(80px)` on the sibling backdrop — real, user-visible jank on every fullscreen open. Fixing without a visual regression needs re-authoring the animation/positioning approach and manual visual verification, not a blind edit.
18. **`HomePage.css`'s infinite background animation**: a `background-position` keyframe loop (`HomePage.css:2,13-23`) runs continuously for as long as Home is mounted — low-grade but constant main-thread repaint, non-compositor property. Smaller than #17 but same category; worth doing together.

## Explicitly low priority (mentioned for completeness, not worth a task on their own)

- `JSON.parse(JSON.stringify(...))` in `PlaylistState.js:193` (`deletePlaylist`) and `CurrPlaylist.jsx:20` (mount-time clone) — both one-off, user-action-frequency, not hot paths. Not worth prioritizing.
- `ArtistState.js`'s unmemoized context value — real, but this provider has no local state of its own driving re-renders, so the practical impact is low. Cheap to bundle into a future context-memoization sweep, not worth its own task.
- `AuthenticationState.js`'s unmemoized value/functions — low blast radius (only login/signup forms consume it).

## How to use this document

Pick one numbered item (or a small cluster, like #1+#2, #7+#8, or #17+#18) as the next task. Each gets its own scoped plan and verification pass when picked — this document is intentionally not itself an implementation plan for all remaining items at once. Mark items done here (with a `~~strikethrough~~` and commit hash, matching #3/#5 above) as they're completed.

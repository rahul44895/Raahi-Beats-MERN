const { spawnSync } = require("child_process");
const path = require("path");

// Resolved from this script's own location (not cwd) so it works identically
// whether invoked from the repo root or from client/ (via `node ../scripts/...`).
const repoRoot = path.join(__dirname, "..");

const result = spawnSync(
  "npx",
  [
    "--prefix",
    repoRoot,
    "prettier",
    "--check",
    ".",
    "--config",
    path.join(repoRoot, ".prettierrc.json"),
    "--ignore-path",
    path.join(repoRoot, ".prettierignore"),
  ],
  { cwd: repoRoot, stdio: "inherit", shell: true }
);

if (result.status !== 0) {
  console.warn(
    "\n[prettier] Some files are not formatted. Run `npm run format` from the repo root to fix.\n"
  );
}

// Never fail the calling npm lifecycle script (prestart/preserver) - this is
// an informational check, not a gate.
process.exit(0);

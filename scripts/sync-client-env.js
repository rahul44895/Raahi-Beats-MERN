const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const CLIENT_ENV_PATH = path.join(__dirname, "..", "client", ".env");

const clientVars = Object.entries(process.env).filter(([key]) =>
  key.startsWith("REACT_APP_")
);

if (clientVars.length === 0) {
  console.warn(
    "[sync-client-env] No REACT_APP_* variables found in the environment. " +
      "client/.env was left untouched. Set REACT_APP_HOST in the root .env " +
      "(local dev) or in your hosting provider's dashboard (deployed builds)."
  );
  process.exit(0);
}

const contents =
  clientVars.map(([key, value]) => `${key}=${value}`).join("\n") + "\n";

fs.writeFileSync(CLIENT_ENV_PATH, contents);
console.log(
  `[sync-client-env] Wrote ${clientVars.length} variable(s) to client/.env`
);

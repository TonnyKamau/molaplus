import { randomBytes, scryptSync } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";

// Never print the password or its derived hash to terminal output.
let hidden = false;
const output = new Writable({ write(chunk, encoding, callback) { if (!hidden) process.stdout.write(chunk, encoding); callback(); } });
const prompt = createInterface({ input: process.stdin, output, terminal: Boolean(process.stdin.isTTY) });
try {
  const email = (await prompt.question("Editor email: ")).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
  process.stdout.write("Password (at least 14 characters, hidden): ");
  hidden = true;
  const password = await prompt.question("");
  hidden = false;
  process.stdout.write("\n");
  if (password.length < 14 || password.length > 256) throw new Error("Use between 14 and 256 characters.");
  process.stdout.write("Confirm password (hidden): "); hidden = true;
  const confirmation = await prompt.question(""); hidden = false; process.stdout.write("\n");
  if (password !== confirmation) throw new Error("Passwords do not match. Nothing was changed.");
  const file = ".env.local";
  const previous = existsSync(file) ? readFileSync(file, "utf8") : "";
  if (/^STUDIO_PASSWORD_HASH=/m.test(previous)) {
    const answer = await prompt.question("Replace the existing editor credentials and invalidate their sessions? Type replace: ");
    if (answer !== "replace") throw new Error("Cancelled. Existing credentials kept.");
  }
  const salt = randomBytes(16).toString("hex");
  const hash = `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
  const rest = previous.split(/\r?\n/).filter((line) => !/^STUDIO_(EMAIL|PASSWORD_HASH)=/.test(line)).join("\n").trimEnd();
  writeFileSync(file, `${rest}\nSTUDIO_EMAIL=${JSON.stringify(email)}\nSTUDIO_PASSWORD_HASH=${hash}\n`, { mode: 0o600 });
  console.log("Editor credentials saved to .env.local. Restart the server and open /studio.");
} catch (error) { hidden = false; console.error(error.message); process.exitCode = 1; }
finally { prompt.close(); }

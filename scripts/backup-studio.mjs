import { DatabaseSync, backup } from "node:sqlite";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const directory = process.env.STUDIO_DATA_DIR || path.join(process.cwd(), ".studio");
const source = path.join(directory, "blog.sqlite");
const destination = process.argv[2];
if (!destination || !existsSync(source)) throw new Error("Usage: node --env-file-if-exists=.env.local scripts/backup-studio.mjs <new-backup.sqlite>. The source database must exist.");
const target = path.resolve(destination);
if (existsSync(target)) throw new Error("Choose a new backup filename; existing files are never overwritten.");
mkdirSync(path.dirname(target), { recursive: true });
const db = new DatabaseSync(source, { readOnly: true });
try { await backup(db, target); console.log(`Complete database backup saved to ${target}`); }
finally { db.close(); }

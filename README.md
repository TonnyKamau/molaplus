# MolaPlus Africa

Next.js 16 / React 19 website with a product catalogue, order requests, distributor directory, Field Notes blog and private publishing studio.

## Run locally

Use Node.js 24 or newer (the studio uses `node:sqlite`).

```sh
npm install
npm run dev
```

Open `http://localhost:3000`. Articles are seeded once into `.studio/blog.sqlite`. Subsequent content changes belong in `/studio`; editing the seed file does not overwrite existing content.

## Configure the publishing studio

```sh
node scripts/setup-studio.mjs
```

Enter the editor email and a password of at least 14 characters. The script saves the email and a salted scrypt hash to the ignored `.env.local`; passwords are hidden and never stored in plain text. Restart the server, then sign in at `/studio`. Re-running setup can rotate credentials and invalidate existing sessions.

The studio supports drafts and autosave, Markdown formatting, preview, cover and inline images, categories, tags, SEO fields, featured articles, publishing, scheduled snapshots, duplication, archiving, restoration, and the last 30 revisions per article. Draft saves leave the public version unchanged. Published/scheduled URLs are locked to protect existing links. Concurrent edits return a conflict instead of overwriting another save.

Scheduled articles become available on the first request at or after their scheduled time. Later draft edits do not change the scheduled snapshot; reschedule to include them. No separate scheduler is required.

The blog includes search, topic filters, sorting, pagination, shareable filter URLs, contents links, sharing, related reading, RSS at `/blog/feed.xml`, and a dynamic sitemap. Resources and homepage articles use published content.

## Production deployment

```sh
npm run build
npm start
```

Use a persistent Node server with a durable disk. Set `STUDIO_DATA_DIR` to an absolute writable data directory and `STUDIO_ORIGIN` to the exact public origin, such as `https://molaplusafrica.com`. Use one application instance with its local SQLite database. Ephemeral/serverless filesystems are unsuitable; a Vercel deployment without explicit storage configuration is rejected. A configured directory alone does not make an ephemeral filesystem durable.

Terminate HTTPS at a trusted reverse proxy. Ensure the proxy replaces incoming `X-Forwarded-For` headers so rate limits use trustworthy client addresses. Public articles and studio actions require the database to be available. Keep environment files and data outside the public directory.

## Order notifications

Set the server variables listed in `.env.example`:

- `AFRICASTALKING_USERNAME`
- `AFRICASTALKING_API_KEY`
- `MOLAPLUS_ORDER_SMS_TO` (order team recipient numbers)
- `AFRICASTALKING_SENDER_ID` (optional registered sender)

Orders validate catalogue products, quantities, Kenyan mobile numbers and delivery details. An order is acknowledged only when the SMS provider accepts a notification for at least one recipient. Missing configuration or rejection displays an error with direct contact alternatives. Acceptance is not proof of handset delivery. The form does not charge a payment; the team confirms availability, pricing and delivery separately.

Provider reference: [Africa’s Talking SMS delivery stages](https://help.africastalking.com/en/articles/742491-why-did-my-messages-fail).

## Backups and recovery

**Publishing guide → Export content** downloads article versions, revision history and uploaded images as base64. Keep exports private. For a complete restorable SQLite backup:

```sh
node --env-file-if-exists=.env.local scripts/backup-studio.mjs backups/blog-2026-09-15.sqlite
```

Use a new filename for each backup. The command uses SQLite’s online backup API, so the database can remain running. Store backups outside ephemeral deployment directories.

To recover: stop the app, preserve the current data directory as a rollback copy, then place a verified backup in a new empty durable directory named `blog.sqlite`. Point `STUDIO_DATA_DIR` to that directory and restart. Do not mix a restored database with old `-wal` or `-shm` files. Rotate studio credentials after recovery to invalidate restored sessions.

## Verification

```sh
npm run lint
npm run build
npm run verify
```

Verification starts a production server on port 3101 with generated test credentials, an isolated database under `test-results`, and SMS credentials explicitly disabled. It checks public routes, seeded article images, authentication/origin checks, publishing and draft isolation, revision conflicts, scheduling, duplication, archiving, uploads, export and invalid/unconfigured orders. It never sends a real SMS. The server stops after the suite; isolated data remains for diagnosis.

## UI references

Mobbin references used for featured story/topic navigation and the editor’s writing/publishing hierarchy:

- [Assembly blog](https://mobbin.com/screens/2ff80227-d048-4a46-954d-97c58ecdb01e)
- [Intercom article editor](https://mobbin.com/screens/9c50cf50-347b-41bc-a9e3-e7022abde080)

# MolaPlus Africa

Next.js 16 / React 19 website with a product catalogue, order requests, distributor directory, Field Notes blog and private publishing studio.

## Run locally

Use Node.js 24 or newer.

```sh
npm install
npm run dev
```

Open `http://localhost:3000`. Public articles and the publishing studio read and write through Supabase.

## Configure the publishing studio

The studio uses Supabase Auth and the `molaplus-studio` Edge Function. Create the editor in Supabase Authentication, then run `supabase/authorize-editor.sql` so the account is present in `public.blog_editors`.

Required app variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Restart the server, then sign in at `/studio` with the Supabase editor account.

The studio supports drafts and autosave, Markdown formatting, preview, cover and inline images, categories, tags, SEO fields, featured articles, publishing, scheduled snapshots, duplication, archiving, restoration, and the last 30 revisions per article. Draft saves leave the public version unchanged. Published/scheduled URLs are locked to protect existing links. Concurrent edits return a conflict instead of overwriting another save.

Scheduled articles become available when the studio Edge Function refreshes due snapshots. Later draft edits do not change the scheduled snapshot; reschedule to include them.

The blog includes search, topic filters, sorting, pagination, shareable filter URLs, contents links, sharing, related reading, RSS at `/blog/feed.xml`, and a dynamic sitemap. Resources and homepage articles use published content.

## Production deployment

```sh
npm run build
npm start
```

Deploy the Supabase migration and Edge Function before switching production traffic to the studio:

```sh
supabase db push --project-ref acgjxvqcwpeuclcfvgak
supabase functions deploy molaplus-studio --project-ref acgjxvqcwpeuclcfvgak
```

Public articles and studio actions require the Supabase project and Edge Function to be available. Keep environment files outside the public directory.

## Order notifications

Set the server variables listed in `.env.example`:

- `AFRICASTALKING_USERNAME`
- `AFRICASTALKING_API_KEY`
- `MOLAPLUS_ORDER_SMS_TO` (order team recipient numbers)
- `AFRICASTALKING_SENDER_ID` (optional registered sender)

Orders validate catalogue products, quantities, Kenyan mobile numbers and delivery details. An order is acknowledged only when the SMS provider accepts a notification for at least one recipient. Missing configuration or rejection displays an error with direct contact alternatives. Acceptance is not proof of handset delivery. The form does not charge a payment; the team confirms availability, pricing and delivery separately.

Provider reference: [Africa’s Talking SMS delivery stages](https://help.africastalking.com/en/articles/742491-why-did-my-messages-fail).

## Backups and recovery

Use Supabase database backups and storage bucket backups from the Supabase dashboard or CLI for full content recovery.

## Verification

```sh
npm run lint
npm run build
```

## UI references

Mobbin references used for featured story/topic navigation and the editor’s writing/publishing hierarchy:

- [Assembly blog](https://mobbin.com/screens/2ff80227-d048-4a46-954d-97c58ecdb01e)
- [Intercom article editor](https://mobbin.com/screens/9c50cf50-347b-41bc-a9e3-e7022abde080)


# MolaPlus — PHP + MySQL backend (Bluehost)

This folder is the **server side** of MolaPlus, written in plain PHP + MySQL so it
runs on standard Bluehost shared hosting (no Node server required).

```
backend/
├── config.sample.php        → copy to config.php and fill in DB + SMS credentials
├── sql/
│   ├── schema.sql           → all MySQL tables (import first)
│   ├── seed-posts.sql       → the 6 starter blog articles (import second)
│   └── create-admin.php     → CLI helper to make a Studio login (bcrypt)
└── public_html/             → upload the CONTENTS of this to your web root
    ├── .htaccess            → routing, HTTPS, caching, security headers
    └── api/
        ├── _bootstrap.php   → shared config + PDO + CORS (not web-callable)
        ├── _catalog.php     → allowed product list (keep in sync with the site)
        ├── orders.php       → POST /api/orders
        ├── blog/
        │   ├── posts.php    → GET  /api/blog/posts   (published articles + views)
        │   ├── comments.php → GET/POST /api/blog/comments
        │   ├── reactions.php→ GET/POST /api/blog/reactions
        │   └── views.php    → POST /api/blog/views
        └── studio/          → the publishing admin (auth required)
            ├── _studio.php  → session auth + post validation (not web-callable)
            ├── session.php  → POST login · GET me · DELETE logout
            ├── posts.php    → GET list · POST create/duplicate
            ├── post.php     → GET /api/studio/posts/{id} · PATCH mutate
            └── media.php    → GET list · POST upload (→ /uploads/blog)
```

## API contract (unchanged from the current site)

| Method & path                       | Body / query                                   | Response |
|-------------------------------------|------------------------------------------------|----------|
| `POST /api/orders`                  | `{name,phone,items:[{name,quantity}],county,town,address,coordinates?,notes?}` | `{ok:true,reference}` |
| `POST /api/blog/views`              | `{slug}`                                        | `{views}` |
| `GET  /api/blog/reactions`          | `?slug=`                                        | `{helpful,notHelpful}` |
| `POST /api/blog/reactions`          | `{slug,reaction,visitorKey}`                    | `{helpful,notHelpful}` |
| `GET  /api/blog/comments`           | `?slug=`                                        | `{comments:[{id,authorName,body,createdAt}]}` |
| `POST /api/blog/comments`           | `{slug,authorName,body}`                        | `{comment:{...}}` |
| `GET  /api/blog/posts`              | *(none)* or `?slug=`                            | `{posts:[...]}` / `{post:{...}}` |
| `POST /api/studio/session`          | `{email,password}`                              | `{editor}` + session cookie |
| `GET  /api/studio/session`          | *(cookie)*                                      | `{authenticated,editor}` |
| `DELETE /api/studio/session`        | *(cookie)*                                      | `{ok:true}` |
| `GET/POST /api/studio/posts`        | *(cookie)* / `{copyId?}`                         | `{posts}` / `{post}` |
| `GET/PATCH /api/studio/posts/{id}`  | `{action,post,revision,...}`                    | `{post,revisions}` / `{post}` |
| `GET/POST /api/studio/media`        | image bytes + `X-File-Name`                     | `{media}` |

Validation, rate limiting (5 orders / 15 min / IP), the honeypot field, Kenyan phone
normalization, and the slug/length rules all mirror the original behavior.

## Deploy to Bluehost — step by step

**1. Create the database** (cPanel → *MySQL Databases*)
- Create a database, e.g. `youruser_molaplus`.
- Create a user, set a strong password, and **add the user to the database with ALL privileges**.

**2. Import the schema** (cPanel → *phpMyAdmin* → select the DB → *Import*)
- Import `sql/schema.sql`, then `sql/seed-posts.sql`.

**3. Add your config**
- Copy `config.sample.php` → `config.php` and fill in the DB name/user/pass,
  your real `site_origin` (e.g. `https://molaplus.org`), and the Africa's
  Talking SMS keys (leave SMS blank to just save orders in the DB).
- **Recommended:** upload `config.php` **one level above** `public_html`
  (e.g. `/home/youruser/molaplus-config.php`). `_bootstrap.php` looks there first.
  If you must keep it inside the web root, the `.htaccess` already denies direct access.

**4. Upload the site files** (cPanel → *File Manager*, or SFTP)
- Upload the **contents** of `public_html/` into your web root (`public_html`):
  the `.htaccess` and the whole `api/` folder.
- Upload the built frontend (static export — see below) into the same web root.

**5. Create a Studio admin login** (optional, for the blog CMS — via SSH)
```bash
php backend/sql/create-admin.php you@example.com "Your Name"
```

**6. Test the endpoints**
```bash
curl -X POST https://YOURDOMAIN/api/blog/views \
  -H "Content-Type: application/json" -d '{"slug":"a-better-dairy-feeding-routine"}'

curl "https://YOURDOMAIN/api/blog/posts"
```

## Local testing with XAMPP

```bash
# 1. create a local DB and import
mysql -u root -e "CREATE DATABASE molaplus_local CHARACTER SET utf8mb4"
mysql -u root molaplus_local < backend/sql/schema.sql
mysql -u root molaplus_local < backend/sql/seed-posts.sql
# 2. backend/config.php -> db host 127.0.0.1, name molaplus_local, user root, no pass
# 3. serve the API
cd backend/public_html && php -S 127.0.0.1:8787
# 4. make an admin, then open http://127.0.0.1:8787/api/blog/posts
php backend/sql/create-admin.php you@example.com "You"
```

## Frontend (the static site)

The current frontend is Next.js. To serve it from Bluehost alongside this PHP API,
build it as a **static export** and upload the output into the same web root. The API
lives at `/api/*` on the same domain, so every `fetch("/api/...")` call keeps working
with no code change.

Deploy it with `scripts/deploy.ps1` (see the root README).

## Security notes
- DB credentials live only in `config.php` — never committed to git.
- All queries use PDO prepared statements.
- `.htaccess` denies direct access to `config.php`, `*.sql`, `*.sample.php`, and the
  `_*.php` includes; forces HTTPS; and sets `nosniff` / `X-Frame-Options` headers.
- Orders are saved to MySQL **before** the SMS attempt, so an order is never lost if
  the SMS provider is down or unconfigured.

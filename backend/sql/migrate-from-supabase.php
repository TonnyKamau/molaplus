<?php
/**
 * One-time migration: Supabase (Postgres) -> MySQL.
 *
 * Copies blog posts, view counts, reactions and comments from the old
 * Supabase project into the new MySQL database. Idempotent (upserts), so
 * it is safe to run more than once.
 *
 *   # credentials via environment (recommended):
 *   SUPABASE_URL="https://xxxx.supabase.co" \
 *   SUPABASE_SERVICE_KEY="eyJ...service_role..." \
 *   php backend/sql/migrate-from-supabase.php
 *
 * The SERVICE ROLE key is required to read drafts + unpublished rows
 * (the anon key only sees published posts). Get it from
 *   Supabase dashboard -> Project settings -> API -> service_role secret.
 *
 * NOTE: editor accounts are NOT migrated — Supabase Auth password hashes
 * cannot be exported. Re-create logins afterwards with:
 *   php backend/sql/create-admin.php you@example.com "Your Name"
 */

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit("Run this from the command line only.\n");
}

$configPath = getenv('MOLAPLUS_CONFIG') ?: (dirname(__DIR__) . '/config.php');
if (!is_file($configPath)) {
    fwrite(STDERR, "Missing config.php (copy config.sample.php first).\n");
    exit(1);
}
$config = require $configPath;

$supabaseUrl = rtrim((string)(getenv('SUPABASE_URL') ?: ''), '/');
$serviceKey  = (string)(getenv('SUPABASE_SERVICE_KEY') ?: '');
if ($supabaseUrl === '' || $serviceKey === '') {
    fwrite(STDERR, "Set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.\n");
    exit(1);
}

$db  = $config['db'];
$pdo = new PDO(
    "mysql:host={$db['host']};dbname={$db['name']};charset=utf8mb4",
    $db['user'],
    $db['pass'],
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);
$pdo->exec("SET time_zone = '+00:00'");

/** Fetch an entire Supabase table through PostgREST, paging in 1000s. */
function supabaseFetch(string $url, string $key, string $table, string $select = '*'): array
{
    $all = [];
    $offset = 0;
    $page = 1000;
    do {
        $endpoint = "$url/rest/v1/$table?select=" . rawurlencode($select);
        // New Supabase secret keys (sb_secret_...) authenticate via the apikey
        // header alone; only legacy JWT keys (eyJ...) go in Authorization.
        $headers = [
            "apikey: $key",
            'Range-Unit: items',
            "Range: $offset-" . ($offset + $page - 1),
        ];
        if (str_starts_with($key, 'eyJ')) {
            $headers[] = "Authorization: Bearer $key";
        }
        $ch = curl_init($endpoint);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 60,
            CURLOPT_HTTPHEADER     => $headers,
        ]);
        $body   = curl_exec($ch);
        $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($body === false || $status >= 400) {
            fwrite(STDERR, "  ! $table fetch failed (HTTP $status): " . substr((string)$body, 0, 200) . "\n");
            break;
        }
        $rows = json_decode((string)$body, true);
        if (!is_array($rows) || !$rows) {
            break;
        }
        $all = array_merge($all, $rows);
        $offset += $page;
    } while (count($rows) === $page);
    return $all;
}

echo "Migrating from $supabaseUrl -> {$db['name']}\n";

// ---- Blog posts --------------------------------------------------------
$posts = supabaseFetch($supabaseUrl, $serviceKey, 'blog_posts', 'id,slug,record,revision,archived,published,published_at');
$ins = $pdo->prepare(
    'INSERT INTO blog_posts (id, slug, record, revision, archived, published, published_at)
     VALUES (?,?,?,?,?,?,?)
     ON DUPLICATE KEY UPDATE slug=VALUES(slug), record=VALUES(record), revision=VALUES(revision),
       archived=VALUES(archived), published=VALUES(published), published_at=VALUES(published_at)'
);
$n = 0;
foreach ($posts as $p) {
    $ins->execute([
        $p['id'],
        $p['slug'] ?: null,
        is_string($p['record']) ? $p['record'] : json_encode($p['record'], JSON_UNESCAPED_UNICODE),
        (int)($p['revision'] ?? 1),
        !empty($p['archived']) ? 1 : 0,
        !empty($p['published']) ? 1 : 0,
        $p['published_at'] ?? null,
    ]);
    $n++;
}
echo "  posts:     $n\n";

// ---- View counts -------------------------------------------------------
$views = supabaseFetch($supabaseUrl, $serviceKey, 'blog_post_views', 'slug,views');
$ins = $pdo->prepare('INSERT INTO blog_post_views (slug, views) VALUES (?,?) ON DUPLICATE KEY UPDATE views=VALUES(views)');
$n = 0;
foreach ($views as $v) { $ins->execute([$v['slug'], (int)($v['views'] ?? 0)]); $n++; }
echo "  views:     $n\n";

// ---- Reactions ---------------------------------------------------------
$reactions = supabaseFetch($supabaseUrl, $serviceKey, 'blog_post_reactions', 'slug,visitor_key,reaction');
$ins = $pdo->prepare(
    'INSERT INTO blog_post_reactions (slug, visitor_key, reaction) VALUES (?,?,?)
     ON DUPLICATE KEY UPDATE reaction=VALUES(reaction)'
);
$n = 0;
foreach ($reactions as $r) {
    if (!in_array($r['reaction'] ?? '', ['helpful', 'not_helpful'], true)) { continue; }
    $ins->execute([$r['slug'], $r['visitor_key'], $r['reaction']]);
    $n++;
}
echo "  reactions: $n\n";

// ---- Comments ----------------------------------------------------------
$comments = supabaseFetch($supabaseUrl, $serviceKey, 'blog_post_comments', 'id,slug,author_name,body,created_at');
$ins = $pdo->prepare(
    'INSERT INTO blog_post_comments (id, slug, author_name, body, created_at) VALUES (?,?,?,?,?)
     ON DUPLICATE KEY UPDATE body=VALUES(body)'
);
$n = 0;
foreach ($comments as $c) {
    $created = isset($c['created_at']) ? date('Y-m-d H:i:s', strtotime($c['created_at'])) : date('Y-m-d H:i:s');
    $ins->execute([$c['id'], $c['slug'], $c['author_name'], $c['body'], $created]);
    $n++;
}
echo "  comments:  $n\n";

// ---- Storage files (uploaded blog images) ------------------------------
$bucket     = 'molaplus-blog-images';
$uploadsDir = getenv('UPLOADS_DIR') ?: (getenv('HOME') . '/public_html/uploads/blog');
if (!is_dir($uploadsDir)) {
    @mkdir($uploadsDir, 0775, true);
}

$listHeaders = ["apikey: $serviceKey", 'Content-Type: application/json'];
if (str_starts_with($serviceKey, 'eyJ')) {
    $listHeaders[] = "Authorization: Bearer $serviceKey";
}
$lc = curl_init("$supabaseUrl/storage/v1/object/list/$bucket");
curl_setopt_array($lc, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_TIMEOUT        => 60,
    CURLOPT_HTTPHEADER     => $listHeaders,
    CURLOPT_POSTFIELDS     => json_encode(['prefix' => '', 'limit' => 1000, 'sortBy' => ['column' => 'name', 'order' => 'asc']]),
]);
$listBody   = curl_exec($lc);
$listStatus = (int) curl_getinfo($lc, CURLINFO_HTTP_CODE);
curl_close($lc);

$files = 0;
if ($listBody !== false && $listStatus < 400) {
    foreach ((json_decode((string) $listBody, true) ?: []) as $obj) {
        $name = $obj['name'] ?? '';
        if ($name === '' || str_ends_with($name, '/')) {
            continue; // skip folders / placeholder rows
        }
        $dl = curl_init("$supabaseUrl/storage/v1/object/public/$bucket/" . rawurlencode($name));
        curl_setopt_array($dl, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 120, CURLOPT_FOLLOWLOCATION => true]);
        $bytes = curl_exec($dl);
        $st    = (int) curl_getinfo($dl, CURLINFO_HTTP_CODE);
        curl_close($dl);
        if ($bytes !== false && $st < 400 && strlen($bytes) > 0) {
            file_put_contents($uploadsDir . '/' . basename($name), $bytes);
            $files++;
        }
    }
} else {
    fwrite(STDERR, "  ! storage list failed (HTTP $listStatus): " . substr((string) $listBody, 0, 200) . "\n");
}
echo "  images:    $files  (saved to $uploadsDir)\n";

// Point every image URL in the posts at the new site instead of Supabase.
$base = "$supabaseUrl/storage/v1/object/public/$bucket/";
$pdo->prepare('UPDATE blog_posts SET record = REPLACE(record, ?, ?)')->execute([$base, '/uploads/blog/']);

echo "Done. Re-create editor logins with create-admin.php.\n";

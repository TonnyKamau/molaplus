<?php
/**
 * GET  /api/blog/comments?slug=...      -> { comments:[{id,authorName,body,createdAt}] }
 * POST /api/blog/comments {slug,authorName,body} -> 201 { comment:{...} }
 */

declare(strict_types=1);
require __DIR__ . '/../_bootstrap.php';

mp_require_method('GET', 'POST');
$pdo = mp_db($MP_CONFIG);

function mp_uuid(): string
{
    $b = random_bytes(16);
    $b[6] = chr((ord($b[6]) & 0x0f) | 0x40);
    $b[8] = chr((ord($b[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($b), 4));
}

$ISO = "DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ')";

if (mp_method() === 'GET') {
    $slug = mp_text($_GET['slug'] ?? '', 200);
    if (!mp_valid_slug($slug)) {
        mp_fail(400, 'Invalid article.');
    }
    $stmt = $pdo->prepare(
        "SELECT id, author_name AS authorName, body, $ISO AS createdAt
         FROM blog_post_comments WHERE slug = ? ORDER BY created_at DESC LIMIT 100"
    );
    $stmt->execute([$slug]);
    mp_json(['comments' => $stmt->fetchAll()]);
}

// POST
$data = mp_body();
$slug       = mp_text($data['slug'] ?? '', 200);
$authorName = mp_text($data['authorName'] ?? '', 80);
$body       = mp_text($data['body'] ?? '', 2000);

if (!mp_valid_slug($slug)
    || mb_strlen($authorName) < 2 || mb_strlen($authorName) > 80
    || mb_strlen($body) < 2 || mb_strlen($body) > 2000) {
    mp_fail(400, 'Add a name and a comment under 2,000 characters.');
}

try {
    $id = mp_uuid();
    $pdo->prepare('INSERT INTO blog_post_comments (id, slug, author_name, body) VALUES (?,?,?,?)')
        ->execute([$id, $slug, $authorName, $body]);

    $stmt = $pdo->prepare(
        "SELECT id, author_name AS authorName, body, $ISO AS createdAt
         FROM blog_post_comments WHERE id = ?"
    );
    $stmt->execute([$id]);
    mp_json(['comment' => $stmt->fetch()], 201);
} catch (Throwable $e) {
    error_log('Could not save blog comment: ' . $e->getMessage());
    mp_fail(500, 'Could not save comment.');
}

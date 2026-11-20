<?php
/**
 * POST /api/blog/views {slug}  -> { views }
 * Atomic upsert increment, mirroring increment_blog_post_view().
 */

declare(strict_types=1);
require __DIR__ . '/../_bootstrap.php';

mp_require_method('POST');
$pdo = mp_db($MP_CONFIG);

$data = mp_body();
$slug = mp_text($data['slug'] ?? '', 200);
if (!mp_valid_slug($slug)) {
    mp_fail(400, 'Invalid article.');
}

try {
    $pdo->prepare(
        'INSERT INTO blog_post_views (slug, views) VALUES (?, 1)
         ON DUPLICATE KEY UPDATE views = views + 1, updated_at = CURRENT_TIMESTAMP'
    )->execute([$slug]);

    $stmt = $pdo->prepare('SELECT views FROM blog_post_views WHERE slug = ?');
    $stmt->execute([$slug]);
    mp_json(['views' => (int)$stmt->fetchColumn()]);
} catch (Throwable $e) {
    error_log('Could not record blog view: ' . $e->getMessage());
    mp_fail(500, 'Could not record view.');
}

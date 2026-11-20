<?php
/**
 * GET  /api/studio/posts           -> { posts:[StudioPost...] }   (all, newest first)
 * POST /api/studio/posts {copyId?} -> { post:StudioPost }         (create / duplicate)
 * Requires an authenticated editor.
 */

declare(strict_types=1);
require __DIR__ . '/_studio.php';

mp_require_method('GET', 'POST');
$pdo = mp_db($MP_CONFIG);
mp_require_editor($pdo);
mp_publish_due($pdo);

if (mp_method() === 'GET') {
    $rows = $pdo->query('SELECT record FROM blog_posts ORDER BY updated_at DESC')->fetchAll();
    $posts = [];
    foreach ($rows as $row) {
        $record = json_decode($row['record'], true);
        if (is_array($record)) {
            $posts[] = $record;
        }
    }
    mp_json(['posts' => $posts]);
}

// POST create / duplicate
$data   = mp_body();
$copyId = isset($data['copyId']) && is_string($data['copyId']) ? $data['copyId'] : null;

$draft = mp_empty_post();
if ($copyId !== null) {
    $source = mp_load_record($pdo, $copyId);
    if (!$source) {
        mp_json(['error' => 'Article not found.'], 404);
    }
    $draft = $source['draft'];
    $draft['title']    = ($draft['title'] ?? '') . ' (copy)';
    $draft['slug']     = '';
    $draft['featured'] = false;
}

$now = mp_now_iso();
$record = [
    'id'          => mp_uuid(),
    'draft'       => $draft,
    'published'   => null,
    'scheduled'   => null,
    'scheduledAt' => null,
    'archived'    => false,
    'revision'    => 1,
    'updatedAt'   => $now,
    'createdAt'   => $now,
];

try {
    mp_save_record($pdo, $record, true);
} catch (Throwable $e) {
    error_log('Studio create failed: ' . $e->getMessage());
    mp_json(['error' => 'Could not create the article.'], 502);
}

mp_json(['post' => $record], 201);

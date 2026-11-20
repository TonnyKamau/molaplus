<?php
/**
 * GET  /api/blog/reactions?slug=...                         -> { helpful, notHelpful }
 * POST /api/blog/reactions {slug,reaction,visitorKey}       -> { helpful, notHelpful }
 *   reaction   : "helpful" | "not_helpful"
 *   visitorKey : [A-Za-z0-9_-]{16,128}  (one vote per visitor per article)
 */

declare(strict_types=1);
require __DIR__ . '/../_bootstrap.php';

mp_require_method('GET', 'POST');
$pdo = mp_db($MP_CONFIG);

function mp_reaction_counts(PDO $pdo, string $slug): array
{
    $stmt = $pdo->prepare(
        "SELECT
            SUM(reaction = 'helpful')     AS helpful,
            SUM(reaction = 'not_helpful') AS not_helpful
         FROM blog_post_reactions WHERE slug = ?"
    );
    $stmt->execute([$slug]);
    $row = $stmt->fetch() ?: [];
    return [
        'helpful'    => (int)($row['helpful'] ?? 0),
        'notHelpful' => (int)($row['not_helpful'] ?? 0),
    ];
}

if (mp_method() === 'GET') {
    $slug = mp_text($_GET['slug'] ?? '', 200);
    if (!mp_valid_slug($slug)) {
        mp_fail(400, 'Invalid article.');
    }
    mp_json(mp_reaction_counts($pdo, $slug));
}

// POST
$data       = mp_body();
$slug       = mp_text($data['slug'] ?? '', 200);
$reaction   = mp_text($data['reaction'] ?? '', 20);
$visitorKey = mp_text($data['visitorKey'] ?? '', 128);

if (!mp_valid_slug($slug)
    || !in_array($reaction, ['helpful', 'not_helpful'], true)
    || !preg_match('/^[a-zA-Z0-9_-]{16,128}$/', $visitorKey)) {
    mp_fail(400, 'Invalid reaction.');
}

try {
    $pdo->prepare(
        'INSERT INTO blog_post_reactions (slug, visitor_key, reaction)
         VALUES (?,?,?)
         ON DUPLICATE KEY UPDATE reaction = VALUES(reaction), updated_at = CURRENT_TIMESTAMP'
    )->execute([$slug, $visitorKey, $reaction]);

    mp_json(mp_reaction_counts($pdo, $slug));
} catch (Throwable $e) {
    error_log('Could not record blog reaction: ' . $e->getMessage());
    mp_fail(500, 'Could not record reaction.');
}

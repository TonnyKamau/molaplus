<?php
/**
 * GET /api/blog/posts            -> { posts:[ Post, ... ] }  (published, newest first)
 * GET /api/blog/posts?slug=...   -> { post: Post }           (single published post)
 *
 * Replaces the server-side publishedPosts() Supabase read so a statically
 * exported frontend can load live blog content. Each post's `views` count is
 * merged in from blog_post_views.
 */

declare(strict_types=1);
require __DIR__ . '/../_bootstrap.php';

mp_require_method('GET');
$pdo = mp_db($MP_CONFIG);

$slug = mp_text($_GET['slug'] ?? '', 200);

try {
    if ($slug !== '') {
        if (!mp_valid_slug($slug)) {
            mp_fail(400, 'Invalid article.');
        }
        $stmt = $pdo->prepare(
            'SELECT record FROM blog_posts WHERE slug = ? AND published = 1 AND archived = 0 LIMIT 1'
        );
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        if (!$row) {
            mp_fail(404, 'Article not found.');
        }
        $record = json_decode($row['record'], true);
        $post = $record['published'] ?? null;
        if (!is_array($post)) {
            mp_fail(404, 'Article not found.');
        }
        $vs = $pdo->prepare('SELECT views FROM blog_post_views WHERE slug = ?');
        $vs->execute([$slug]);
        $post['views'] = (int)$vs->fetchColumn();
        mp_json(['post' => $post]);
    }

    $rows = $pdo->query(
        'SELECT record FROM blog_posts WHERE published = 1 AND archived = 0 ORDER BY published_at DESC'
    )->fetchAll();

    $posts = [];
    foreach ($rows as $row) {
        $record = json_decode($row['record'], true);
        $post = is_array($record) ? ($record['published'] ?? null) : null;
        if (is_array($post) && !empty($post['slug'])) {
            $posts[] = $post;
        }
    }

    // featured first, then newest date — same ordering the site used.
    usort($posts, static function ($a, $b) {
        $f = (int)($b['featured'] ?? 0) <=> (int)($a['featured'] ?? 0);
        if ($f !== 0) {
            return $f;
        }
        return strcmp((string)($b['date'] ?? ''), (string)($a['date'] ?? ''));
    });

    if ($posts) {
        $slugs = array_column($posts, 'slug');
        $in = implode(',', array_fill(0, count($slugs), '?'));
        $vs = $pdo->prepare("SELECT slug, views FROM blog_post_views WHERE slug IN ($in)");
        $vs->execute($slugs);
        $views = [];
        foreach ($vs->fetchAll() as $v) {
            $views[$v['slug']] = (int)$v['views'];
        }
        foreach ($posts as &$post) {
            $post['views'] = $views[$post['slug']] ?? 0;
        }
        unset($post);
    }

    mp_json(['posts' => $posts]);
} catch (Throwable $e) {
    error_log('Could not load blog posts: ' . $e->getMessage());
    mp_fail(500, 'Could not load articles.');
}

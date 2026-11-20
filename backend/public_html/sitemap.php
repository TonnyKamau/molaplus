<?php
/**
 * Live XML sitemap — always current, including posts added in the Studio.
 * Routed from /sitemap.xml via .htaccess so search engines always see the
 * latest published articles without waiting for a site rebuild.
 */

declare(strict_types=1);
require __DIR__ . '/api/_bootstrap.php';

header('Content-Type: application/xml; charset=utf-8');

$base = rtrim((string)($MP_CONFIG['site_origin'] ?? 'https://molaplus.org'), '/');

$staticPages = [
    ['', '1.0'],
    ['/products', '0.9'],
    ['/products/super-milk-booster', '0.8'],
    ['/product-comparison', '0.7'],
    ['/consultancy', '0.8'],
    ['/resources', '0.7'],
    ['/blog', '0.8'],
    ['/distributors', '0.7'],
    ['/outlets', '0.6'],
    ['/about-us', '0.6'],
    ['/contact', '0.6'],
    ['/order', '0.7'],
    ['/privacy', '0.3'],
    ['/terms', '0.3'],
];

$urls = '';
foreach ($staticPages as [$path, $priority]) {
    $loc = htmlspecialchars($base . $path, ENT_XML1);
    $urls .= "<url><loc>$loc</loc><changefreq>weekly</changefreq><priority>$priority</priority></url>";
}

try {
    $pdo = mp_db($MP_CONFIG);
    $rows = $pdo->query(
        'SELECT slug, published_at, updated_at FROM blog_posts WHERE published = 1 AND archived = 0 AND slug IS NOT NULL ORDER BY published_at DESC'
    )->fetchAll();
    foreach ($rows as $row) {
        $loc = htmlspecialchars($base . '/blog/' . $row['slug'], ENT_XML1);
        $lastmod = '';
        $date = $row['updated_at'] ?: $row['published_at'];
        if ($date) {
            $ts = strtotime((string)$date);
            if ($ts) {
                $lastmod = '<lastmod>' . gmdate('Y-m-d', $ts) . '</lastmod>';
            }
        }
        $urls .= "<url><loc>$loc</loc>$lastmod<changefreq>monthly</changefreq><priority>0.6</priority></url>";
    }
} catch (Throwable $e) {
    // Fall back to just the static pages if the DB is unavailable.
    error_log('Sitemap DB read failed: ' . $e->getMessage());
}

echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . $urls . '</urlset>';

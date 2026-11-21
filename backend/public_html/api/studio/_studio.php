<?php
/**
 * Shared Studio admin layer: cookie-session auth + post validation/model,
 * mirroring the former Supabase Edge Function (molaplus-studio).
 *
 * Every /api/studio/* endpoint requires this file.
 */

declare(strict_types=1);
require __DIR__ . '/../_bootstrap.php';

const MP_ADMIN_COOKIE  = 'mp_admin';
const MP_SESSION_HOURS = 12;
const MP_UPLOAD_DIR    = 'uploads/blog';   // under the web root
const MP_CATEGORIES    = ['Dairy', 'Poultry', 'Livestock', 'Farm management'];

function mp_now_iso(): string
{
    return gmdate('Y-m-d\TH:i:s.000\Z');
}

function mp_uuid(): string
{
    $b = random_bytes(16);
    $b[6] = chr((ord($b[6]) & 0x0f) | 0x40);
    $b[8] = chr((ord($b[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($b), 4));
}

function mp_is_https(): bool
{
    return (($_SERVER['HTTPS'] ?? '') !== '' && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
}

// -------------------------------------------------------------------- //
//  Sessions
// -------------------------------------------------------------------- //
function mp_set_session_cookie(string $token, int $expires): void
{
    setcookie(MP_ADMIN_COOKIE, $token, [
        'expires'  => $expires,
        'path'     => '/',
        'httponly' => true,
        'secure'   => mp_is_https(),
        'samesite' => 'Lax',
    ]);
}

function mp_clear_session_cookie(): void
{
    setcookie(MP_ADMIN_COOKIE, '', [
        'expires'  => time() - 3600,
        'path'     => '/',
        'httponly' => true,
        'secure'   => mp_is_https(),
        'samesite' => 'Lax',
    ]);
}

/** Current editor row, or null. Also prunes expired sessions. */
function mp_current_editor(PDO $pdo): ?array
{
    $raw = $_COOKIE[MP_ADMIN_COOKIE] ?? '';
    if (!preg_match('/^[a-f0-9]{64}$/', $raw)) {
        return null;
    }
    $hash = hash('sha256', $raw);
    $pdo->prepare('DELETE FROM admin_sessions WHERE expires_at < NOW()')->execute();
    $stmt = $pdo->prepare(
        'SELECT e.id, e.email, e.display_name
         FROM admin_sessions s JOIN blog_editors e ON e.id = s.editor_id
         WHERE s.token = ? AND s.expires_at >= NOW() LIMIT 1'
    );
    $stmt->execute([$hash]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function mp_require_editor(PDO $pdo): array
{
    $editor = mp_current_editor($pdo);
    if (!$editor) {
        mp_json(['error' => 'Please sign in with an approved studio account.'], 401);
    }
    return $editor;
}

// Fixed valid bcrypt hash used to keep sign-in timing constant whether or not
// the email exists (prevents account enumeration via response timing).
const MP_DUMMY_HASH = '$2y$12$rvcYjkZXBN7QnTBPpiCQFukx9/pN3mpI8uG5cyNaKkfBgpyKOhKfK';

function mp_login(PDO $pdo, string $email, string $password): array
{
    $ip = mp_client_ip();

    // Brute-force protection: at most 10 failed attempts per IP / 15 minutes.
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS login_attempts (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            ip VARCHAR(45) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id), KEY idx_login_ip_time (ip, created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
    );
    $pdo->prepare('DELETE FROM login_attempts WHERE created_at < (NOW() - INTERVAL 15 MINUTE)')->execute();
    $recent = $pdo->prepare('SELECT COUNT(*) FROM login_attempts WHERE ip = ? AND created_at >= (NOW() - INTERVAL 15 MINUTE)');
    $recent->execute([$ip]);
    if ((int)$recent->fetchColumn() >= 10) {
        mp_json(['error' => 'Too many sign-in attempts. Please wait 15 minutes, then try again.'], 429);
    }

    $stmt = $pdo->prepare('SELECT id, email, display_name, password_hash FROM blog_editors WHERE email = ? LIMIT 1');
    $stmt->execute([mb_strtolower(trim($email))]);
    $editor = $stmt->fetch();

    // Always run password_verify (against a dummy hash if the email is unknown)
    // so both cases take the same time.
    $verified = password_verify($password, $editor['password_hash'] ?? MP_DUMMY_HASH);
    if (!$editor || !$verified) {
        $pdo->prepare('INSERT INTO login_attempts (ip) VALUES (?)')->execute([$ip]);
        mp_json(['error' => 'Email or password is incorrect.'], 401);
    }

    // Successful login — clear this IP's failed attempts.
    $pdo->prepare('DELETE FROM login_attempts WHERE ip = ?')->execute([$ip]);

    $token   = bin2hex(random_bytes(32));
    $hash    = hash('sha256', $token);
    $expires = time() + MP_SESSION_HOURS * 3600;
    $pdo->prepare('INSERT INTO admin_sessions (token, editor_id, expires_at) VALUES (?,?,FROM_UNIXTIME(?))')
        ->execute([$hash, $editor['id'], $expires]);
    mp_set_session_cookie($token, $expires);
    return ['id' => $editor['id'], 'email' => $editor['email'], 'display_name' => $editor['display_name']];
}

function mp_logout(PDO $pdo): void
{
    $raw = $_COOKIE[MP_ADMIN_COOKIE] ?? '';
    if (preg_match('/^[a-f0-9]{64}$/', $raw)) {
        $pdo->prepare('DELETE FROM admin_sessions WHERE token = ?')->execute([hash('sha256', $raw)]);
    }
    mp_clear_session_cookie();
}

// -------------------------------------------------------------------- //
//  Post validation (mirror of the edge function)
// -------------------------------------------------------------------- //
class MpStudioError extends RuntimeException
{
    public int $status;
    public function __construct(string $message, int $status = 400)
    {
        parent::__construct($message);
        $this->status = $status;
    }
}

function mp_safe_link(string $value): bool
{
    return preg_match('#^/(?!/)[a-zA-Z0-9/_?=&%\#.,+-]*$#', $value) === 1
        || preg_match('#^https://[^\s<>"\\\\]+$#', $value) === 1;
}

function mp_valid_image(string $value): bool
{
    return preg_match('#^/molaplus/[a-z0-9-]+\.webp$#', $value) === 1
        || preg_match('#^/uploads/blog/[a-f0-9-]{36}\.(webp|png|jpg)$#', $value) === 1;
}

function mp_str($value, int $max, string $field): string
{
    if (!is_string($value) || mb_strlen($value) > $max) {
        throw new MpStudioError("$field must be text under $max characters.");
    }
    return trim($value);
}

function mp_validate_post($input, bool $publishing = false): array
{
    if (!is_array($input) || array_is_list($input)) {
        throw new MpStudioError('Invalid article.');
    }
    $title = mp_str($input['title'] ?? null, 180, 'Title');
    $slug  = mp_str($input['slug'] ?? null, 100, 'URL slug');
    if ($slug !== '' && !preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug)) {
        throw new MpStudioError('The URL slug can contain lowercase letters, numbers and hyphens.');
    }
    if (!in_array($input['category'] ?? null, MP_CATEGORIES, true)) {
        throw new MpStudioError('Choose an article category.');
    }
    $image = mp_str($input['image'] ?? null, 500, 'Cover image');
    if ($image !== '' && !mp_valid_image($image)) {
        throw new MpStudioError('Choose a library image or upload a cover image.');
    }
    $date = mp_str($input['date'] ?? null, 10, 'Publication date');
    $d = DateTime::createFromFormat('Y-m-d', $date);
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || !$d || $d->format('Y-m-d') !== $date) {
        throw new MpStudioError('Enter a valid publication date.');
    }
    $relatedHref = mp_str($input['relatedHref'] ?? '', 300, 'Related link');
    if ($relatedHref !== '' && !mp_safe_link($relatedHref)) {
        throw new MpStudioError('Related links must be a site path or an HTTPS address.');
    }
    $tagsIn = $input['tags'] ?? null;
    if (!is_array($tagsIn) || count($tagsIn) > 10) {
        throw new MpStudioError('Use up to 10 tags.');
    }
    $sourcesIn = $input['sources'] ?? null;
    if (!is_array($sourcesIn) || count($sourcesIn) > 12) {
        throw new MpStudioError('Use up to 12 sources.');
    }
    $sources = [];
    foreach ($sourcesIn as $source) {
        if (!is_array($source)) {
            throw new MpStudioError('Invalid source.');
        }
        $href = mp_str($source['href'] ?? null, 500, 'Source address');
        if ($publishing && !mp_safe_link($href)) {
            throw new MpStudioError('Source links must be a site path or an HTTPS address.');
        }
        $stitle = mp_str($source['title'] ?? null, 180, 'Source title');
        if ($publishing && $stitle === '') {
            throw new MpStudioError('Give each source a title before publishing.');
        }
        $sources[] = ['title' => $stitle, 'href' => $href];
    }
    $tags = [];
    foreach ($tagsIn as $tag) {
        $t = mp_str($tag, 40, 'Tag');
        if ($t !== '' && !in_array($t, $tags, true)) {
            $tags[] = $t;
        }
    }
    $post = [
        'title'        => $title,
        'slug'         => $slug,
        'category'     => $input['category'],
        'excerpt'      => mp_str($input['excerpt'] ?? null, 500, 'Excerpt'),
        'image'        => $image,
        'imageAlt'     => mp_str($input['imageAlt'] ?? null, 200, 'Image description'),
        'date'         => $date,
        'takeaway'     => mp_str($input['takeaway'] ?? null, 500, 'Takeaway'),
        'body'         => mp_str($input['body'] ?? null, 100000, 'Article body'),
        'sections'     => [],
        'author'       => mp_str($input['author'] ?? null, 100, 'Author'),
        'tags'         => $tags,
        'seoTitle'     => mp_str($input['seoTitle'] ?? '', 180, 'SEO title'),
        'seoDescription' => mp_str($input['seoDescription'] ?? '', 500, 'SEO description'),
        'featured'     => ($input['featured'] ?? null) === true,
        'sources'      => $sources,
        'relatedHref'  => $relatedHref,
        'relatedLabel' => mp_str($input['relatedLabel'] ?? '', 100, 'Related link label'),
    ];
    if ($publishing && ($post['title'] === '' || $post['slug'] === '' || $post['excerpt'] === ''
        || $post['image'] === '' || $post['imageAlt'] === '' || $post['author'] === '' || trim($post['body']) === '')) {
        throw new MpStudioError('Add a title, URL slug, excerpt, cover image, image description, author and article text before publishing.');
    }
    if ($publishing && $relatedHref !== '' && $post['relatedLabel'] === '') {
        throw new MpStudioError('Give the related link a label.');
    }
    return $post;
}

function mp_empty_post(): array
{
    return [
        'title' => '', 'slug' => '', 'excerpt' => '', 'category' => 'Farm management',
        'image' => '', 'imageAlt' => '', 'date' => gmdate('Y-m-d'), 'takeaway' => '',
        'body' => '', 'sections' => [], 'sources' => [], 'relatedHref' => '/consultancy',
        'relatedLabel' => 'Talk to our team', 'author' => 'MolaPlus', 'tags' => [],
        'seoTitle' => '', 'seoDescription' => '', 'featured' => false,
    ];
}

/** Persist a StudioPost record into blog_posts (insert or update). */
function mp_save_record(PDO $pdo, array $record, bool $insert = false): void
{
    $cols = [
        'slug'         => ($record['draft']['slug'] ?? '') !== '' ? $record['draft']['slug'] : null,
        'record'       => json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'revision'     => $record['revision'],
        'archived'     => $record['archived'] ? 1 : 0,
        'published'    => !empty($record['published']) ? 1 : 0,
        'published_at' => $record['published']['date'] ?? null,
        'updated_at'   => str_replace(['T', '.000Z'], [' ', ''], $record['updatedAt']),
    ];
    if ($insert) {
        $pdo->prepare(
            'INSERT INTO blog_posts (id, slug, record, revision, archived, published, published_at, updated_at, created_at)
             VALUES (?,?,?,?,?,?,?,?, NOW())'
        )->execute([
            $record['id'], $cols['slug'], $cols['record'], $cols['revision'],
            $cols['archived'], $cols['published'], $cols['published_at'], $cols['updated_at'],
        ]);
    } else {
        $pdo->prepare(
            'UPDATE blog_posts SET slug=?, record=?, revision=?, archived=?, published=?, published_at=?, updated_at=?
             WHERE id=?'
        )->execute([
            $cols['slug'], $cols['record'], $cols['revision'], $cols['archived'],
            $cols['published'], $cols['published_at'], $cols['updated_at'], $record['id'],
        ]);
    }
}

function mp_load_record(PDO $pdo, string $id): ?array
{
    $stmt = $pdo->prepare('SELECT record FROM blog_posts WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    return $row ? json_decode($row['record'], true) : null;
}

/** Add a revision row for the draft, keeping only the newest 30. */
function mp_add_revision(PDO $pdo, array $record, string $action): void
{
    $pdo->prepare('INSERT INTO blog_revisions (post_id, content, action) VALUES (?,?,?)')
        ->execute([$record['id'], json_encode($record['draft'], JSON_UNESCAPED_UNICODE), $action]);
    $pdo->prepare(
        'DELETE FROM blog_revisions WHERE post_id = ? AND id NOT IN
           (SELECT id FROM (SELECT id FROM blog_revisions WHERE post_id = ? ORDER BY id DESC LIMIT 30) keep)'
    )->execute([$record['id'], $record['id']]);
}

/** Publish any scheduled posts whose time has arrived. */
function mp_publish_due(PDO $pdo): void
{
    $rows = $pdo->query('SELECT record FROM blog_posts')->fetchAll();
    foreach ($rows as $row) {
        $record = json_decode($row['record'], true);
        if (!is_array($record) || !empty($record['archived'])) {
            continue;
        }
        $at = $record['scheduledAt'] ?? null;
        if ($record['scheduled'] && $at && strtotime($at) !== false && strtotime($at) <= time()) {
            $record['published']   = $record['scheduled'];
            $record['scheduled']   = null;
            $record['scheduledAt'] = null;
            $record['revision']    = (int)$record['revision'] + 1;
            $record['updatedAt']   = mp_now_iso();
            mp_save_record($pdo, $record);
        }
    }
}

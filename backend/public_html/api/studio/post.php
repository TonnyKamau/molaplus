<?php
/**
 * GET   /api/studio/posts/{id}  -> { post:StudioPost, revisions:[...] }
 * PATCH /api/studio/posts/{id}  { action, post?, revision, scheduledAt?, revisionId? } -> { post }
 *   actions: save | publish | schedule | cancel-schedule | unpublish | archive | restore | restore-revision
 * Requires an authenticated editor.
 */

declare(strict_types=1);
require __DIR__ . '/_studio.php';

mp_require_method('GET', 'PATCH');
$pdo = mp_db($MP_CONFIG);
mp_require_editor($pdo);
mp_publish_due($pdo);

$id = mp_text($_GET['id'] ?? '', 36);
if (!preg_match('/^[a-f0-9-]{36}$/', $id)) {
    mp_json(['error' => 'Article id is required.'], 400);
}

// -------- GET: load post + recent revisions --------
if (mp_method() === 'GET') {
    $record = mp_load_record($pdo, $id);
    if (!$record) {
        mp_json(['error' => 'Article not found.'], 404);
    }
    $rev = $pdo->prepare(
        "SELECT id, post_id, content, action, DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ') AS created_at
         FROM blog_revisions WHERE post_id = ? ORDER BY id DESC LIMIT 30"
    );
    $rev->execute([$id]);
    $revisions = array_map(static fn ($r) => [
        'id'        => (int)$r['id'],
        'postId'    => $r['post_id'],
        'content'   => json_decode($r['content'], true),
        'createdAt' => $r['created_at'],
        'action'    => $r['action'],
    ], $rev->fetchAll());
    mp_json(['post' => $record, 'revisions' => $revisions]);
}

// -------- PATCH: mutate --------
$input    = mp_body();
$action   = mp_text($input['action'] ?? '', 40);

// Permanent delete — handled first, unconditionally (no revision needed), and
// tolerant of the row id vs the id stored inside the record ever differing.
// FK cascade removes the article's revisions.
if ($action === 'delete') {
    try {
        $stmt = $pdo->prepare('DELETE FROM blog_posts WHERE id = ? OR JSON_UNQUOTE(JSON_EXTRACT(record, "$.id")) = ?');
        $stmt->execute([$id, $id]);
        if ($stmt->rowCount() > 0) {
            mp_json(['deleted' => true]);
        }
        mp_json(['error' => 'Article not found.'], 404);
    } catch (Throwable $e) {
        error_log('Studio delete failed: ' . $e->getMessage());
        mp_json(['error' => 'Could not delete the article.'], 502);
    }
}

$revision = $input['revision'] ?? null;
if ($action === '' || !is_int($revision)) {
    mp_json(['error' => 'Missing article revision or action.'], 400);
}

$record = mp_load_record($pdo, $id);
if (!$record) {
    mp_json(['error' => 'Article not found.'], 404);
}
if ((int)$record['revision'] !== (int)$revision) {
    mp_json(['error' => 'This article changed in another window. Reload before saving to avoid overwriting changes.'], 409);
}

if (!empty($record['archived']) && $action !== 'restore') {
    mp_json(['error' => 'Restore this article before editing it.'], 400);
}

try {
    mp_add_revision($pdo, $record, $action);

    if (in_array($action, ['save', 'publish', 'schedule'], true)) {
        $post = mp_validate_post($input['post'] ?? null, $action !== 'save');
        if (($record['published'] || $record['scheduled']) && $post['slug'] !== ($record['draft']['slug'] ?? '')) {
            throw new MpStudioError('Unpublish and cancel scheduling before changing the URL slug.');
        }
        if ($post['slug'] !== '') {
            $dup = $pdo->prepare('SELECT id FROM blog_posts WHERE slug = ? AND id <> ? LIMIT 1');
            $dup->execute([$post['slug'], $id]);
            if ($dup->fetch()) {
                mp_json(['error' => 'Another article already uses this URL slug.'], 409);
            }
        }
        $record['draft'] = $post;
    }

    if ($action === 'publish') {
        $record['published']   = $record['draft'];
        $record['scheduled']   = null;
        $record['scheduledAt'] = null;
    }
    if ($action === 'schedule') {
        $ts = strtotime((string)($input['scheduledAt'] ?? ''));
        if ($ts === false || $ts < time() + 60) {
            throw new MpStudioError('Choose a publication time at least one minute in the future.');
        }
        $scheduled = $record['draft'];
        $scheduled['date'] = gmdate('Y-m-d', $ts);
        $record['scheduled']   = $scheduled;
        $record['scheduledAt'] = gmdate('Y-m-d\TH:i:s.000\Z', $ts);
    }
    if ($action === 'cancel-schedule') {
        $record['scheduled']   = null;
        $record['scheduledAt'] = null;
    }
    if ($action === 'unpublish' || $action === 'archive') {
        $record['published']   = null;
        $record['scheduled']   = null;
        $record['scheduledAt'] = null;
    }
    if ($action === 'archive') {
        $record['archived'] = true;
    }
    if ($action === 'restore') {
        $record['archived'] = false;
    }
    if ($action === 'restore-revision') {
        $rid = $input['revisionId'] ?? null;
        $rr = $pdo->prepare('SELECT content FROM blog_revisions WHERE id = ? AND post_id = ? LIMIT 1');
        $rr->execute([$rid, $id]);
        $restored = $rr->fetch();
        if (!$restored) {
            mp_json(['error' => 'Revision not found.'], 404);
        }
        $content = json_decode($restored['content'], true);
        $content['slug'] = $record['draft']['slug'] ?? '';
        $record['draft'] = $content;
    }

    $record['revision']  = (int)$record['revision'] + 1;
    $record['updatedAt'] = mp_now_iso();
    mp_save_record($pdo, $record);
    mp_json(['post' => $record]);
} catch (MpStudioError $e) {
    mp_json(['error' => $e->getMessage()], $e->status);
} catch (Throwable $e) {
    error_log('Studio mutate failed: ' . $e->getMessage());
    mp_json(['error' => 'Could not save the article. Your writing is still here.'], 502);
}

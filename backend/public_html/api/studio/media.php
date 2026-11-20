<?php
/**
 * GET  /api/studio/media  -> { media:[...] }      (uploaded images, newest first)
 * POST /api/studio/media   body = image bytes
 *        headers: Content-Type: image/(jpeg|png|webp), X-File-Name: <encoded>
 *        -> { media:{ id,name,url,createdAt,width,height } }   (201)
 * Requires an authenticated editor. Files are stored under /uploads/blog.
 */

declare(strict_types=1);
require __DIR__ . '/_studio.php';

mp_require_method('GET', 'POST');
$pdo = mp_db($MP_CONFIG);
mp_require_editor($pdo);

$webRoot   = dirname(__DIR__, 2);          // public_html
$uploadDir = $webRoot . '/' . MP_UPLOAD_DIR;

if (mp_method() === 'GET') {
    $media = [];
    if (is_dir($uploadDir)) {
        $files = glob($uploadDir . '/*.{webp,png,jpg}', GLOB_BRACE) ?: [];
        usort($files, static fn ($a, $b) => filemtime($b) <=> filemtime($a));
        foreach ($files as $file) {
            $name = basename($file);
            $media[] = [
                'id'        => pathinfo($name, PATHINFO_FILENAME),
                'name'      => $name,
                'url'       => '/' . MP_UPLOAD_DIR . '/' . $name,
                'createdAt' => gmdate('Y-m-d\TH:i:s\Z', filemtime($file) ?: time()),
                'width'     => 0,
                'height'    => 0,
            ];
        }
    }
    mp_json(['media' => $media]);
}

// POST upload
$type = strtolower(trim(explode(';', $_SERVER['HTTP_CONTENT_TYPE'] ?? $_SERVER['CONTENT_TYPE'] ?? '')[0]));
$allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
if (!isset($allowed[$type])) {
    mp_json(['error' => 'Upload a JPG, PNG or WebP image under 5 MB.'], 400);
}

$bytes = file_get_contents('php://input', false, null, 0, 5 * 1024 * 1024 + 1);
if ($bytes === false || strlen($bytes) < 32 || strlen($bytes) > 5 * 1024 * 1024) {
    mp_json(['error' => 'Upload a JPG, PNG or WebP image under 5 MB.'], 400);
}

// Confirm the bytes really are the claimed image type.
$finfoType = (new finfo(FILEINFO_MIME_TYPE))->buffer($bytes);
if ($finfoType !== $type) {
    mp_json(['error' => 'Upload a JPG, PNG or WebP image under 5 MB.'], 400);
}

if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
    error_log('Could not create upload dir: ' . $uploadDir);
    mp_json(['error' => 'Image upload failed. Please try again.'], 502);
}

$id   = mp_uuid();
$ext  = $allowed[$type];
$name = $id . '.' . $ext;
if (file_put_contents($uploadDir . '/' . $name, $bytes) === false) {
    error_log('Could not write upload: ' . $name);
    mp_json(['error' => 'Image upload failed. Please try again.'], 502);
}

$rawName = $_SERVER['HTTP_X_FILE_NAME'] ?? '';
$label   = $rawName !== '' ? mb_substr(rawurldecode($rawName), 0, 150) : $name;

mp_json(['media' => [
    'id'        => $id,
    'name'      => $label,
    'url'       => '/' . MP_UPLOAD_DIR . '/' . $name,
    'createdAt' => mp_now_iso(),
    'width'     => 0,
    'height'    => 0,
]], 201);

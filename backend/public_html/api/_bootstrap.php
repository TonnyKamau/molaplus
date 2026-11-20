<?php
/**
 * Shared bootstrap for every MolaPlus API endpoint.
 *  - loads config
 *  - opens a single PDO MySQL connection
 *  - applies CORS + security headers
 *  - provides small JSON request/response helpers
 *
 * Every endpoint starts with:  require __DIR__ . '/_bootstrap.php';
 */

declare(strict_types=1);

mb_internal_encoding('UTF-8');
date_default_timezone_set('UTC');

// Never leak PHP warnings/notices into a JSON response body.
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// --------------------------------------------------------------------
//  Load configuration
// --------------------------------------------------------------------
function mp_load_config(): array
{
    // 1) Explicit path via environment (set in .htaccess or server config).
    $envPath = getenv('MOLAPLUS_CONFIG');
    $candidates = [];
    if ($envPath) {
        $candidates[] = $envPath;
    }
    // 2) One level above the document root (recommended, outside web root).
    if (!empty($_SERVER['DOCUMENT_ROOT'])) {
        $candidates[] = dirname($_SERVER['DOCUMENT_ROOT']) . '/molaplus-config.php';
    }
    // 3) Alongside the backend folder (dev / fallback).
    $candidates[] = dirname(__DIR__, 2) . '/config.php';

    foreach ($candidates as $path) {
        if ($path && is_file($path)) {
            $config = require $path;
            if (is_array($config)) {
                return $config;
            }
        }
    }

    mp_fail(500, 'Server is not configured. Missing config.php.');
}

// --------------------------------------------------------------------
//  Response helpers
// --------------------------------------------------------------------
function mp_json($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function mp_fail(int $status, string $message): void
{
    mp_json(['ok' => false, 'message' => $message, 'error' => $message], $status);
}

function mp_body(): array
{
    $raw = file_get_contents('php://input', false, null, 0, 16001);
    if ($raw === false || strlen($raw) > 16000) {
        mp_fail(413, 'Request body is too large.');
    }
    if ($raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        mp_fail(400, 'Invalid request.');
    }
    return $data;
}

function mp_text($value, int $max = 200): string
{
    if (!is_string($value)) {
        return '';
    }
    return mb_substr(trim($value), 0, $max);
}

function mp_client_ip(): string
{
    $fwd = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if ($fwd !== '') {
        $first = trim(explode(',', $fwd)[0]);
        if ($first !== '') {
            return mb_substr($first, 0, 45);
        }
    }
    return mb_substr($_SERVER['REMOTE_ADDR'] ?? 'unknown', 0, 45);
}

// --------------------------------------------------------------------
//  CORS + security headers
// --------------------------------------------------------------------
function mp_apply_cors(array $config): void
{
    $allowed = rtrim((string)($config['site_origin'] ?? ''), '/');
    $origin  = rtrim($_SERVER['HTTP_ORIGIN'] ?? '', '/');

    // Same-origin requests send no Origin header — always fine.
    if ($origin !== '' && $allowed !== '' && $origin === $allowed) {
        header('Access-Control-Allow-Origin: ' . $allowed);
        header('Vary: Origin');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        header('Access-Control-Max-Age: 600');
    }

    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');

    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

// --------------------------------------------------------------------
//  Database
// --------------------------------------------------------------------
function mp_db(array $config): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $db = $config['db'] ?? [];
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        $db['host'] ?? 'localhost',
        $db['name'] ?? '',
        $db['charset'] ?? 'utf8mb4'
    );
    try {
        $pdo = new PDO($dsn, $db['user'] ?? '', $db['pass'] ?? '', [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
        // Keep all timestamps in UTC regardless of the host's default zone.
        $pdo->exec("SET time_zone = '+00:00'");
    } catch (Throwable $e) {
        error_log('MolaPlus DB connection failed: ' . $e->getMessage());
        mp_fail(500, 'The service is temporarily unavailable. Please try again shortly.');
    }
    return $pdo;
}

function mp_method(): string
{
    return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
}

function mp_require_method(string ...$methods): void
{
    if (!in_array(mp_method(), $methods, true)) {
        header('Allow: ' . implode(', ', $methods));
        mp_fail(405, 'Method not allowed.');
    }
}

// Shared slug rule — identical to the former Postgres check.
const MP_SLUG_PATTERN = '/^[a-z0-9]+(-[a-z0-9]+)*$/';

function mp_valid_slug(string $slug): bool
{
    return $slug !== '' && preg_match(MP_SLUG_PATTERN, $slug) === 1;
}

// --------------------------------------------------------------------
//  Boot
// --------------------------------------------------------------------
$MP_CONFIG = mp_load_config();
mp_apply_cors($MP_CONFIG);

<?php
/**
 * One-off CLI helper to create / reset a Studio admin login.
 *
 *   php backend/sql/create-admin.php you@example.com "Your Name"
 *
 * It prompts for a password (hidden) and writes a bcrypt hash into
 * blog_editors. Run it from a shell on Bluehost (SSH) or locally against
 * the same database. Delete or keep it out of public_html — it is NOT a
 * web endpoint.
 */

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit("Run this from the command line only.\n");
}

$configPath = getenv('MOLAPLUS_CONFIG') ?: (dirname(__DIR__) . '/config.php');
if (!is_file($configPath)) {
    fwrite(STDERR, "Missing config.php. Copy backend/config.sample.php to backend/config.php first.\n");
    exit(1);
}
$config = require $configPath;

$email = trim($argv[1] ?? '');
$name  = trim($argv[2] ?? '');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fwrite(STDERR, "Usage: php create-admin.php <email> [display name]\n");
    exit(1);
}

fwrite(STDOUT, "Password: ");
shell_exec('stty -echo 2>/dev/null');
$password = trim((string)fgets(STDIN));
shell_exec('stty echo 2>/dev/null');
fwrite(STDOUT, "\n");

if (strlen($password) < 10) {
    fwrite(STDERR, "Please use a password of at least 10 characters.\n");
    exit(1);
}

$db  = $config['db'];
$pdo = new PDO(
    "mysql:host={$db['host']};dbname={$db['name']};charset=utf8mb4",
    $db['user'],
    $db['pass'],
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

$hash = password_hash($password, PASSWORD_DEFAULT);
$pdo->prepare(
    'INSERT INTO blog_editors (email, password_hash, display_name)
     VALUES (?,?,?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), display_name = VALUES(display_name)'
)->execute([$email, $hash, $name !== '' ? $name : null]);

fwrite(STDOUT, "Admin saved for {$email}.\n");

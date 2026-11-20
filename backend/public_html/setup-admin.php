<?php
/**
 * ONE-TIME Studio admin setup — no SSH required.
 *
 * Upload this file into public_html, open https://molaplus.org/setup-admin.php
 * in your browser, create your login, then DELETE this file.
 *
 * Safety: it only works while NO admin exists yet (first run). Once an admin
 * is created it refuses to do anything, but you should still delete it.
 */

declare(strict_types=1);
require __DIR__ . '/api/_bootstrap.php';

$pdo = mp_db($MP_CONFIG);

$existing = (int) $pdo->query('SELECT COUNT(*) FROM blog_editors')->fetchColumn();
$error = '';
$done = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($existing > 0) {
        $error = 'An admin already exists. Please delete this file now.';
    } else {
        $email = trim((string) ($_POST['email'] ?? ''));
        $pass  = (string) ($_POST['password'] ?? '');
        $name  = trim((string) ($_POST['name'] ?? ''));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $error = 'Enter a valid email address.';
        } elseif (mb_strlen($pass) < 10) {
            $error = 'Use a password of at least 10 characters.';
        } else {
            $hash = password_hash($pass, PASSWORD_DEFAULT);
            $pdo->prepare('INSERT INTO blog_editors (email, password_hash, display_name) VALUES (?,?,?)')
                ->execute([$email, $hash, $name !== '' ? $name : null]);
            $done = true;
        }
    }
}

header('Content-Type: text/html; charset=utf-8');
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>MolaPlus — Studio setup</title>
<style>
  :root { color-scheme: light; }
  body { margin:0; min-height:100vh; display:grid; place-items:center; background:#f3efe5; color:#10251b; font-family:system-ui,Segoe UI,Arial,sans-serif; }
  .card { width:min(440px,92vw); background:#fff; border:1px solid rgba(16,37,27,.14); border-radius:14px; padding:28px; }
  h1 { font-size:22px; margin:0 0 4px; }
  p.sub { margin:0 0 20px; color:#53645b; font-size:14px; }
  label { display:block; font-size:13px; font-weight:700; margin:14px 0 6px; }
  input { width:100%; box-sizing:border-box; padding:11px 12px; border:1px solid #bfc9be; border-radius:8px; font-size:15px; }
  button { margin-top:20px; width:100%; padding:12px; border:0; border-radius:8px; background:#0c432c; color:#fff; font-weight:800; font-size:15px; cursor:pointer; }
  .err { background:#ffdad6; color:#93000a; padding:10px 12px; border-radius:8px; font-size:14px; margin-top:14px; }
  .ok { background:#d7f5df; color:#0c432c; padding:16px; border-radius:8px; font-size:15px; }
  code { background:#f1f5ee; padding:2px 6px; border-radius:4px; }
</style>
</head>
<body>
<div class="card">
<?php if ($done): ?>
  <h1>✅ Admin created</h1>
  <div class="ok">
    <p style="margin:0 0 10px">You can now sign in at <strong>/studio</strong>.</p>
    <p style="margin:0"><strong>Important:</strong> delete this file (<code>setup-admin.php</code>) from <code>public_html</code> now, for security.</p>
  </div>
<?php elseif ($existing > 0): ?>
  <h1>Already set up</h1>
  <p class="sub">An admin account already exists. Please delete <code>setup-admin.php</code> from <code>public_html</code>.</p>
<?php else: ?>
  <h1>Create your Studio login</h1>
  <p class="sub">This one-time page sets up your MolaPlus publishing account.</p>
  <?php if ($error): ?><div class="err"><?= htmlspecialchars($error, ENT_QUOTES) ?></div><?php endif; ?>
  <form method="post">
    <label>Your name</label>
    <input name="name" placeholder="Jane Mwangi" autocomplete="name">
    <label>Email address</label>
    <input name="email" type="email" required placeholder="you@molaplus.org" autocomplete="username">
    <label>Password (min 10 characters)</label>
    <input name="password" type="password" required minlength="10" autocomplete="new-password">
    <button type="submit">Create admin →</button>
  </form>
<?php endif; ?>
</div>
</body>
</html>

<?php
/**
 * POST   /api/studio/session   {email,password}  -> { editor }       (login)
 * GET    /api/studio/session                      -> { authenticated, editor? }
 * DELETE /api/studio/session                      -> { ok:true }       (logout)
 */

declare(strict_types=1);
require __DIR__ . '/_studio.php';

mp_require_method('GET', 'POST', 'DELETE');
$pdo = mp_db($MP_CONFIG);

switch (mp_method()) {
    case 'POST':
        $data  = mp_body();
        $email = mp_text($data['email'] ?? '', 190);
        $pass  = is_string($data['password'] ?? null) ? $data['password'] : '';
        if ($email === '' || $pass === '') {
            mp_json(['error' => 'Enter your email and password.'], 400);
        }
        $editor = mp_login($pdo, $email, $pass);
        mp_json(['editor' => ['email' => $editor['email'], 'name' => $editor['display_name']]]);
        break;

    case 'DELETE':
        mp_logout($pdo);
        mp_json(['ok' => true]);
        break;

    default: // GET
        $editor = mp_current_editor($pdo);
        mp_json([
            'authenticated' => (bool)$editor,
            'editor' => $editor ? ['email' => $editor['email'], 'name' => $editor['display_name']] : null,
        ]);
}

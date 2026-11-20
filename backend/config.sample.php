<?php
/**
 * MolaPlus backend configuration — SAMPLE.
 *
 * Copy this file to `config.php` and fill in your real values.
 * On Bluehost, place `config.php` ONE LEVEL ABOVE public_html if you can
 * (e.g. /home/USER/molaplus-config.php) and point MOLAPLUS_CONFIG at it,
 * so database credentials are never web-accessible. The api/_bootstrap.php
 * loader looks for it there first, then falls back to this folder.
 *
 * NEVER commit the real config.php to git.
 */

return [
    // ---- MySQL (from cPanel -> MySQL Databases) -------------------------
    'db' => [
        'host'    => 'localhost',
        'name'    => 'youruser_molaplus',
        'user'    => 'youruser_molaplus',
        'pass'    => 'CHANGE_ME',
        'charset' => 'utf8mb4',
    ],

    // ---- Allowed site origin for CORS / order submissions --------------
    // The exact origin the public site is served from (no trailing slash).
    'site_origin' => 'https://molaplus.org',

    // ---- Africa's Talking SMS (optional; order alerts) -----------------
    // Leave blank to disable SMS — orders are still saved to the database.
    'sms' => [
        'username'  => '',
        'api_key'   => '',
        'recipients'=> '',      // e.g. +254722656142
        'sender_id' => '',      // optional short code / alphanumeric
    ],

    // ---- Email order alerts (PHP mail on Bluehost) --------------------
    // Leave 'to' blank to disable email — orders are still saved + SMS sent.
    'email' => [
        'to'   => '',                           // where new-order emails go
        'from' => 'orders@molaplus.org',  // must be a mailbox on your domain
        'from_name' => 'MolaPlus Orders',
    ],
];

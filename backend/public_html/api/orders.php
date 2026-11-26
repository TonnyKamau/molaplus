<?php
/**
 * POST /api/orders
 * Validate an order, persist it to MySQL, and (optionally) SMS the team.
 * Mirrors the former Next.js route contract exactly:
 *   request : { name, phone, items:[{name,quantity}], county, town, address,
 *               coordinates?, notes?, website? (honeypot) }
 *   success : { ok:true, reference:"MP-XXXXXXXX" }
 *   failure : { ok:false, message:"..." }  with an appropriate status code
 */

declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

mp_require_method('POST');

$pdo = mp_db($MP_CONFIG);

/** Normalize a Kenyan phone number, or '' if invalid. */
function mp_normalize_phone(string $value): string
{
    $cleaned = preg_replace('/[\s()\-]/', '', $value);
    if (preg_match('/^0[17]\d{8}$/', $cleaned)) {
        return '+254' . substr($cleaned, 1);
    }
    if (preg_match('/^254[17]\d{8}$/', $cleaned)) {
        return '+' . $cleaned;
    }
    if (preg_match('/^\+254[17]\d{8}$/', $cleaned)) {
        return $cleaned;
    }
    return '';
}

/** Sliding 15-minute, max-5 rate limit per IP, backed by the DB. */
function mp_rate_limited(PDO $pdo, string $ip): bool
{
    // prune old rows occasionally, then count + record this attempt
    $pdo->prepare('DELETE FROM order_rate_limit WHERE created_at < (NOW() - INTERVAL 15 MINUTE)')->execute();
    $count = $pdo->prepare('SELECT COUNT(*) FROM order_rate_limit WHERE ip = ? AND created_at >= (NOW() - INTERVAL 15 MINUTE)');
    $count->execute([$ip]);
    $attempts = (int)$count->fetchColumn();
    $pdo->prepare('INSERT INTO order_rate_limit (ip) VALUES (?)')->execute([$ip]);
    return $attempts >= 5;
}

function mp_send_sms(array $sms, string $message): array
{
    $username   = $sms['username'] ?? '';
    $apiKey     = $sms['api_key'] ?? '';
    $recipients = $sms['recipients'] ?? '';
    if ($username === '' || $apiKey === '' || $recipients === '') {
        return ['configured' => false];
    }

    $fields = ['username' => $username, 'to' => $recipients, 'message' => $message];
    if (!empty($sms['sender_id'])) {
        $fields['from'] = $sms['sender_id'];
    }

    $ch = curl_init('https://api.africastalking.com/version1/messaging');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => [
            'Accept: application/json',
            'Content-Type: application/x-www-form-urlencoded',
            'apiKey: ' . $apiKey,
        ],
        CURLOPT_POSTFIELDS     => http_build_query($fields),
    ]);
    $response = curl_exec($ch);
    $status   = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($response === false || $status < 200 || $status >= 300) {
        throw new RuntimeException('SMS provider returned ' . $status);
    }
    $result    = json_decode((string)$response, true);
    $deliveries = $result['SMSMessageData']['Recipients'] ?? null;
    $accepted  = is_array($deliveries) && array_filter(
        $deliveries,
        static fn ($r) => (int)($r['statusCode'] ?? 0) === 101
    );
    if (!$accepted) {
        throw new RuntimeException('SMS provider did not accept the notification.');
    }
    return ['configured' => true];
}

function mp_send_email(array $email, string $reference, string $message): bool
{
    $to = trim($email['to'] ?? '');
    if ($to === '') {
        return false;
    }
    $from     = $email['from'] ?? 'orders@localhost';
    $fromName = $email['from_name'] ?? 'MolaPlus Orders';
    $subject  = "New MolaPlus order $reference";
    $headers  = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=utf-8',
        'From: ' . mb_encode_mimeheader($fromName) . " <$from>",
        'Reply-To: ' . $from,
        'X-Mailer: MolaPlus',
    ];
    // @ — never let a mail failure break the order response; we log instead.
    $ok = @mail($to, $subject, $message, implode("\r\n", $headers), '-f' . $from);
    if (!$ok) {
        error_log("Order email to $to failed for $reference");
    }
    return $ok;
}

// -------------------------------------------------------------------- //
$ip   = mp_client_ip();
$data = mp_body();

// Honeypot — pretend success, store nothing.
if (mp_text($data['website'] ?? '') !== '') {
    mp_json(['ok' => true, 'reference' => 'MP-RECEIVED']);
}

if (mp_rate_limited($pdo, $ip)) {
    mp_fail(429, 'Too many order attempts. Please wait a few minutes or call us.');
}

$catalog = require __DIR__ . '/_catalog.php';
$catalogSet = array_flip($catalog);

$name    = mp_text($data['name'] ?? '', 80);
$phone   = mp_normalize_phone(mp_text($data['phone'] ?? '', 30));
$county  = mp_text($data['county'] ?? '', 80);
$town    = mp_text($data['town'] ?? '', 80);
$address = mp_text($data['address'] ?? '', 220);
$coords  = mp_text($data['coordinates'] ?? '', 60);
$notes   = mp_text($data['notes'] ?? '', 220);

$rawItems = is_array($data['items'] ?? null) ? $data['items'] : [];
$items = [];
foreach (array_slice($rawItems, 0, 20) as $item) {
    $item = is_array($item) ? $item : [];
    $items[] = [
        'name'     => mp_text($item['name'] ?? '', 120),
        'quantity' => is_numeric($item['quantity'] ?? null) ? (int)$item['quantity'] : -1,
    ];
}

$names = array_column($items, 'name');
$validItems = count($rawItems) <= 20
    && count($items) > 0
    && count(array_unique($names)) === count($names)
    && array_reduce($items, static function ($ok, $item) use ($catalogSet) {
        return $ok
            && isset($catalogSet[$item['name']])
            && $item['quantity'] >= 1
            && $item['quantity'] <= 999;
    }, true);

if ($name === '' || $phone === '' || !$validItems || $county === '' || $town === '' || $address === '') {
    mp_fail(400, 'Please provide a valid name, Kenyan phone number, order items and delivery location.');
}

$reference = 'MP-' . strtoupper(substr(bin2hex(random_bytes(5)), 0, 8));
$location  = "$county, $town — $address" . ($coords !== '' ? " (GPS $coords)" : '');
$orderLines = implode("\n", array_map(static fn ($i) => "{$i['quantity']} x {$i['name']}", $items));
$message = "NEW ORDER $reference\n$orderLines\n$name $phone\nDeliver: $location" . ($notes !== '' ? "\nNotes: $notes" : '');

// Persist first, so no order is ever lost even if SMS fails.
try {
    $stmt = $pdo->prepare(
        'INSERT INTO orders (reference, customer_name, phone, county, town, address, coordinates, notes, items, ip)
         VALUES (?,?,?,?,?,?,?,?,?,?)'
    );
    $stmt->execute([
        $reference, $name, $phone, $county, $town, $address,
        $coords !== '' ? $coords : null,
        $notes !== '' ? $notes : null,
        json_encode($items, JSON_UNESCAPED_UNICODE),
        $ip,
    ]);
} catch (Throwable $e) {
    error_log('Order insert failed: ' . $e->getMessage());
    mp_fail(500, 'We could not save your order. Please call +254 724 968 847.');
}

// Then notify the team by email + SMS. The order is already saved, so we
// always return success — a missing/failed alert never loses the order.
mp_send_email($MP_CONFIG['email'] ?? [], $reference, $message);

try {
    $sms = mp_send_sms($MP_CONFIG['sms'] ?? [], $message);
    if (!empty($sms['configured'])) {
        $pdo->prepare('UPDATE orders SET sms_sent = 1 WHERE reference = ?')->execute([$reference]);
    }
} catch (Throwable $e) {
    error_log('Order SMS failed: ' . $e->getMessage());
}

mp_json(['ok' => true, 'reference' => $reference]);

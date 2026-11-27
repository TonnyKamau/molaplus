// Regenerate backend/public_html/api/_catalog.php from lib/products.ts so the
// server accepts exactly the products the website offers.
//   node scripts/sync-catalog.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ts = createRequire(import.meta.url)("typescript");

const source = readFileSync(path.join(root, "lib/products.ts"), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const mod = { exports: {} };
new Function("module", "exports", js)(mod, mod.exports);
const items = mod.exports.orderItems().map(([name]) => name);

const php = `<?php
/**
 * Canonical product catalog: only names in this list are accepted on an order.
 * GENERATED from lib/products.ts by scripts/sync-catalog.mjs; do not edit by hand.
 */
return [
${items.map((n) => `    ${JSON.stringify(n).replace(/^"|"$/g, "'").replace(/\\"/g, '"')},`).join("\n")}
];
`;
writeFileSync(path.join(root, "backend/public_html/api/_catalog.php"), php, "utf8");
console.log(`Wrote ${items.length} orderable items to backend/public_html/api/_catalog.php`);

import { orderItems, products as range, type CategoryId } from "../products";

/**
 * Orderable items: one per product pack size, built from lib/products.ts.
 * The server accepts exactly these names (backend/public_html/api/_catalog.php,
 * regenerated with `node scripts/sync-catalog.mjs`).
 */
export const products = orderItems();

const categoryLabels: Record<CategoryId, [en: string, fr: string]> = {
  dairy: ["Dairy & cattle", "Bovins laitiers et de boucherie"],
  poultry: ["Poultry", "Volaille"],
  livestock: ["Pigs, sheep & livestock", "Porcs, ovins et bétail"],
  crops: ["Crops & soil", "Cultures et sols"],
};

/** Category label for an order item such as "Ranch Cubes — 10KG". */
export function itemCategory(itemName: string, fr = false) {
  const product = range.find((p) => itemName.startsWith(`${p.name} — `));
  const [en, frLabel] = categoryLabels[product?.category ?? "dairy"];
  return fr ? frLabel : en;
}

import type { Item } from "../types/item";
export function changeItems(items: Item[], id: string, diff: number) {
  const entry = items.find((x) => x.id === id);
  if (!entry) return diff > 0 ? [...items, { id, qty: diff }] : items;
  return items
    .map((x) => (x.id === id ? { ...x, qty: Math.max(0, x.qty + diff) } : x))
    .filter((x) => x.qty > 0);
}

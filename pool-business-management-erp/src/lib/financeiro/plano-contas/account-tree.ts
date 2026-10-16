import type { ChartAccountRow } from "./types";

export function accountTree(rows: ChartAccountRow[]) {
  const ids = new Set(rows.map((row) => row.id));
  const children = new Map<string | null, ChartAccountRow[]>();
  for (const row of rows) {
    const parent = row.parentId && ids.has(row.parentId) ? row.parentId : null;
    children.set(parent, [...(children.get(parent) ?? []), row]);
  }
  for (const siblings of children.values()) {
    siblings.sort((a, b) =>
      a.code.localeCompare(b.code, "pt-BR", { numeric: true }),
    );
  }
  const result: {
    account: ChartAccountRow;
    depth: number;
    ancestors: string[];
    hasChildren: boolean;
  }[] = [];
  const visited = new Set<string>();
  function visit(row: ChartAccountRow, ancestors: string[]) {
    if (visited.has(row.id)) return;
    visited.add(row.id);
    result.push({
      account: row,
      depth: ancestors.length,
      ancestors,
      hasChildren: !!children.get(row.id)?.length,
    });
    for (const child of children.get(row.id) ?? [])
      visit(child, [...ancestors, row.id]);
  }
  for (const row of children.get(null) ?? []) visit(row, []);
  for (const row of rows) if (!visited.has(row.id)) visit(row, []);
  return result;
}

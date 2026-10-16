import assert from "node:assert/strict";
import test from "node:test";
import { accountTree } from "../src/lib/financeiro/plano-contas/account-tree";
import type { ChartAccountRow } from "../src/lib/financeiro/plano-contas/types";

const row = (id: string, code: string, parentId?: string): ChartAccountRow => ({
  id,
  code,
  parentId,
  shortCode: id,
  name: code,
  active: true,
});

test("organiza níveis e ordena códigos numericamente mesmo com entrada desordenada", () => {
  const tree = accountTree([
    row("c", "1.10", "a"),
    row("b", "1.2", "a"),
    row("a", "1"),
    row("d", "1.2.01", "b"),
  ]);
  assert.deepEqual(
    tree.map((item) => [item.account.id, item.depth]),
    [
      ["a", 0],
      ["b", 1],
      ["d", 2],
      ["c", 1],
    ],
  );
  assert.deepEqual(tree[2].ancestors, ["a", "b"]);
  assert.equal(tree[1].hasChildren, true);
  assert.equal(tree[2].hasChildren, false);
});
test("recolher um ramo oculta todos os descendentes sem afetar irmãos", () => {
  const tree = accountTree([
    row("a", "1"),
    row("b", "1.1", "a"),
    row("c", "1.1.1", "b"),
    row("d", "1.2", "a"),
  ]);
  assert.deepEqual(
    tree
      .filter((item) => !item.ancestors.includes("b"))
      .map((item) => item.account.id),
    ["a", "b", "d"],
  );
});
test("contas órfãs e ciclos não desaparecem nem causam recursão infinita", () => {
  const tree = accountTree([
    row("a", "1", "b"),
    row("b", "2", "a"),
    row("c", "3", "missing"),
  ]);
  assert.equal(tree.length, 3);
  assert.equal(new Set(tree.map((item) => item.account.id)).size, 3);
});

import assert from "node:assert/strict";
import test from "node:test";
import { buildHeaderAlerts } from "../src/lib/header/build-header-alerts";

const today = "2026-10-16";

test("preserves critical stock boundaries, ordering and three-item limit", () => {
  const inventory = [
    { productName: "Ruptura", physical: 0, reserved: 0, minimumStock: 10 },
    { productName: "No mínimo", physical: 10, reserved: 0, minimumStock: 10 },
    { productName: "D", physical: 9, reserved: 0, minimumStock: 10 },
    { productName: "C", physical: 8, reserved: 0, minimumStock: 10 },
    { productName: "B", physical: 7, reserved: 0, minimumStock: 10 },
    { productName: "A", physical: "6", reserved: "2", minimumStock: "10" },
  ];
  const alerts = buildHeaderAlerts(inventory, [], today);
  assert.deepEqual(
    alerts.map((alert) => alert.title),
    ["A abaixo do mínimo", "B abaixo do mínimo", "C abaixo do mínimo"],
  );
  assert.equal(alerts[0].desc, "Disponível 4 · mínimo 10");
});

test("counts only unpaid, non-cancelled receivables before today", () => {
  const receivables = [
    { status: "PENDING", dueDate: "2026-10-15" },
    { status: "OVERDUE", dueDate: "2026-10-10" },
    { status: "PAID", dueDate: "2026-10-14" },
    { status: "CANCELLED", dueDate: "2026-10-14" },
    { status: "PENDING", dueDate: today },
    { status: "PENDING", dueDate: "2026-10-17" },
  ];
  assert.deepEqual(buildHeaderAlerts([], receivables, today), [
    {
      title: "2 contas a receber vencidas",
      desc: "Cobrança recomendada hoje",
      tone: "amber",
    },
  ]);
});

test("does not create alerts without permitted data", () => {
  assert.deepEqual(buildHeaderAlerts([], [], today), []);
});

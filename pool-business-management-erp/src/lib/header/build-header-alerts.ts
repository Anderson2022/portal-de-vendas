import type {
  HeaderAlert,
  InventoryAlertSummary,
  ReceivableAlertSummary,
} from "./types/header-alert";

export function buildHeaderAlerts(
  inventory: InventoryAlertSummary[],
  receivables: ReceivableAlertSummary[],
  today: string,
): HeaderAlert[] {
  const alerts = inventory
    .map((item) => ({
      name: item.productName,
      available: Number(item.physical ?? 0) - Number(item.reserved ?? 0),
      minStock: Number(item.minimumStock ?? 0),
    }))
    .filter((item) => item.available > 0 && item.available < item.minStock)
    .sort((a, b) => a.available - a.minStock - (b.available - b.minStock))
    .slice(0, 3)
    .map((item) => ({
      title: `${item.name} abaixo do mínimo`,
      desc: `Disponível ${item.available} · mínimo ${item.minStock}`,
      tone: "red",
    }));

  const overdueCount = receivables.filter(
    (item) =>
      item.status !== "CANCELLED" &&
      item.status !== "PAID" &&
      (item.dueDate ?? "").slice(0, 10) < today,
  ).length;

  if (overdueCount > 0) {
    alerts.push({
      title: `${overdueCount} contas a receber vencidas`,
      desc: "Cobrança recomendada hoje",
      tone: "amber",
    });
  }

  return alerts;
}

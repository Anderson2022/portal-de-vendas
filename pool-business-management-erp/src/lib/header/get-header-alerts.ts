import "server-only";
import { api } from "@/lib/backend/client";
import { buildHeaderAlerts } from "./build-header-alerts";
import type {
  InventoryAlertSummary,
  ReceivableAlertSummary,
} from "./types/header-alert";

export async function getHeaderAlerts(permissions: readonly string[]) {
  const canViewStock =
    permissions.includes("STOCK_VIEW") && permissions.includes("PRODUCT_VIEW");
  const [inventory, receivables] = await Promise.all([
    canViewStock
      ? api<InventoryAlertSummary[]>("/inventory")
      : Promise.resolve([]),
    permissions.includes("FINANCIAL_VIEW")
      ? api<ReceivableAlertSummary[]>("/financial/receivables")
      : Promise.resolve([]),
  ]);
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Cuiaba",
  });

  return buildHeaderAlerts(inventory, receivables, today);
}

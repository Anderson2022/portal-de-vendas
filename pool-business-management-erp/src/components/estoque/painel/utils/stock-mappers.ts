import type { StockOverviewData } from "../stock-overview-types";

export function mapProductsForMovement(s: StockOverviewData) {
  return s.rows.map((p) => ({
    id: p.id,
    name: p.name,
  }));
}

export function mapProductsForTransfer(s: StockOverviewData) {
  return s.rows.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    unitId: String(p.values.unitId || ""),
    unitName: p.unit,
    warehouseId: String(p.values.warehouseId || ""),
    available: p.available,
  }));
}

export function mapProductsForAdjustment(s: StockOverviewData) {
  return s.rows.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    unit: p.unit,
    stock: p.stock,
    reserved: p.reserved,
    warehouseId: String(p.values.warehouseId || ""),
  }));
}

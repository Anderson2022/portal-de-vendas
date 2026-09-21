import type { Option } from "../product-types";

export type LookupKind = "category" | "brand" | "unit" | "type" | "warehouse" | "manufacturer" | "model" | "material" | "finish" | "warranty" | "supplier" | "packageQuantity";
export type LookupRecord = Option & { value: string; persisted: boolean; level?: number; active?: boolean };
export type LookupInput = { name: string; code?: string; documentNumber?: string; phone?: string; email?: string };
export type LookupSeeds = { categories: Option[]; brands: Option[]; warehouses: Option[]; suppliers?: Option[] };
export type LookupConfig = { numeric?: boolean; min?: number; step?: number; remote?: boolean; code?: boolean };

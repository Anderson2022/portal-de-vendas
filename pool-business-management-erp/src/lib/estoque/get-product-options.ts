import { backendData } from "@/lib/backend/data";
import { listProductReferences } from "./product-references";
import { listStockWarehouses } from "./stock-structure";

export async function getProductOptions() {
  const [{ suppliers }, categories, brands, warehouses] = await Promise.all([
    backendData(),
    listProductReferences("category"),
    listProductReferences("brand"),
    listStockWarehouses(),
  ]);
  return {
    categories: categories.map((item) => ({ id: item.id, name: item.name })),
    brands: brands.map((item) => ({ id: item.id, name: item.name })),
    warehouses: warehouses.map((item) => ({ id: String(item.id), name: item.name })),
    suppliers,
  };
}

"use server";

import { revalidatePath } from "next/cache";
import { api } from "../backend/client";

const value = (fd: FormData, key: string) =>
  String(fd.get(key) ?? "").trim();

const numberValue = (fd: FormData, key: string) => {
  const raw = value(fd, key).replace(",", ".");
  const parsed = Number(raw);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error("Informe valores numéricos não negativos para preços e estoque.");
  }
  return parsed;
};

type CreatedProduct = {
  id: string;
};

export async function createProduct(fd: FormData, productId?: string) {
  const name = value(fd, "name");

  if (!name) {
    throw new Error("Nome do produto é obrigatório.");
  }
  if (name.length > 180 || value(fd, "sku").length > 60 || value(fd, "barcode").length > 60 || value(fd, "description").length > 1000) {
    throw new Error("Revise os limites de tamanho do nome, SKU, código de barras e descrição.");
  }

  const initialCost = numberValue(fd, "initialCost");
  const initialStock = numberValue(fd, "initialStock");
  const details = Object.fromEntries(Array.from(fd.entries()).map(([key, entry]) => [key, String(entry)]));

  /*
   * 1. Cadastra o produto.
   */
  const product = await api<CreatedProduct>(productId ? `/products/${productId}` : "/products", {
    method: productId ? "PUT" : "POST",
    body: JSON.stringify({
      sku: value(fd, "sku") || null,
      barcode: value(fd, "barcode") || null,

      name,
      description: value(fd, "description") || null,

      categoryId:
        value(fd, "categoryId") || null,
      brandId: value(fd, "brandId") || null,
      supplierId: value(fd, "supplierId") || null,
      defaultWarehouseId: value(fd, "warehouseId") || null,
      defaultLocationId: value(fd, "defaultLocationId") || null,
      defaultPositionId: value(fd, "defaultPositionId") || null,
      productType: value(fd, "productType") || "STANDARD",
      unitId: value(fd, "unitId") || null,
      taxUnitId: value(fd, "taxUnitId") || null,
      purchaseUnitId: value(fd, "purchaseUnitId") || null,
      unitsPerPackage: numberValue(fd, "unitsPerPackage"),
      manufacturerId: value(fd, "manufacturerId") || null,
      modelId: value(fd, "modelId") || null,
      materialId: value(fd, "materialId") || null,
      finishId: value(fd, "finishId") || null,
      detailsJson: JSON.stringify(details),

      costPrice: initialCost,

      salePrice:
        numberValue(fd, "salePrice"),

      minimumStock:
        numberValue(fd, "minimumStock"),

      unit:
        value(fd, "unit") || "UN",
      active: value(fd, "active") !== "false",
    }),
  });

 
  let warning = "";
  if (!productId && initialStock > 0) {
    try {
    await api("/inventory/movements", {
      method: "POST",
      body: JSON.stringify({
        productId: product.id,

        warehouseId:
          value(fd, "warehouseId") || null,

        type: "ENTRY",

        quantity: initialStock,

        unitCost: initialCost,

        referenceType: "INITIAL_STOCK",

        referenceId: null,

        notes:
          "Estoque inicial do cadastro do produto",
      }),
    });
    } catch {
      warning = "Produto cadastrado, mas a entrada inicial não foi registrada. Registre a entrada em Nova movimentação; não cadastre o produto novamente.";
    }
  }

  revalidatePath("/estoque");
  revalidatePath("/estoque/produtos");

  return { ...product, warning };
}

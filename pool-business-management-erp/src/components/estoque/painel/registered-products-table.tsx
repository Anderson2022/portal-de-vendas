"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Package, Pencil, Trash2 } from "lucide-react";
import { Badge, Card, SectionTitle } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProductForm } from "../produto/product-form";
import type { ProductFormProps } from "../produto/product-types";
import { deleteProduct } from "@/lib/estoque/delete-product";
import type { StockOverviewData } from "./stock-overview-types";

type Row = StockOverviewData["rows"][number];

export function RegisteredProductsTable({ rows, productOptions }: {
  rows: Row[];
  productOptions: Pick<ProductFormProps, "categories" | "brands" | "warehouses" | "suppliers">;
}) {
  const [selected, setSelected] = useState<Row | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function remove(id: string) {
    if (!window.confirm("Excluir este produto?")) return;
    startTransition(async () => { await deleteProduct(id); router.refresh(); });
  }

  return <Card className="fade-up overflow-hidden p-6 pb-3">
    <SectionTitle icon={<Package size={17} />} title="Produtos cadastrados" />
    <div className="-mx-6 mt-4 overflow-x-auto">
      <table className="tbl min-w-[1050px]">
        <thead><tr><th>ID</th><th>Código / SKU</th><th>Produto</th><th>Categoria</th><th>Marca</th><th>Unidade</th><th>Tipo</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>{rows.map((product) => <tr key={product.id} className="cursor-pointer" onDoubleClick={() => setSelected(product)}>
          <td className="font-bold">{product.id}</td>
          <td>{product.sku || "—"}</td>
          <td className="font-extrabold">{product.name}</td>
          <td>{productOptions.categories.find((category) => category.id === product.values.categoryId)?.name || "—"}</td>
          <td>{productOptions.brands.find((brand) => brand.id === product.values.brandId)?.name || "—"}</td>
          <td>{product.unit || "—"}</td>
          <td>{String((product.values as Record<string, string>).productType || "Produto comum")}</td>
          <td><Badge tone={product.values.active === "false" ? "slate" : "green"}>{product.values.active === "false" ? "Inativo" : "Ativo"}</Badge></td>
          <td><div className="flex gap-1"><Button type="button" className="!p-2" title="Editar" onClick={() => setSelected(product)}><Pencil size={15} /></Button><Button type="button" className="!p-2 text-coral-500" title="Excluir" disabled={pending} onClick={() => remove(product.id)}><Trash2 size={15} /></Button></div></td>
        </tr>)}</tbody>
      </table>
    </div>
    {selected && <Modal open title="Editar Produto" width="max-w-6xl" height="h-[90vh]" onClose={() => setSelected(null)}><ProductForm {...productOptions} product={{ id: selected.id, values: selected.values }} onCancel={() => setSelected(null)} onSuccess={() => { setSelected(null); router.refresh(); }} /></Modal>}
  </Card>;
}

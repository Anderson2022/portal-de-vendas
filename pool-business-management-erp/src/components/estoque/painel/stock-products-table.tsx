"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Package, Pencil, Trash2 } from "lucide-react";
import { Badge, Card, SectionTitle } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProductForm } from "@/components/estoque/produto/product-form";
import type { ProductFormProps } from "@/components/estoque/produto/product-types";
import { deleteProduct } from "@/lib/estoque/delete-product";
import { brl, n, type Tone } from "@/lib/format";
import type { StockOverviewData } from "./stock-overview-types";

const statusMap: Record<string, { label: string; tone: Tone }> = {
  OK: { label: "Saudável", tone: "green" },
  BAIXO: { label: "Baixo", tone: "amber" },
  CRITICO: { label: "Crítico", tone: "red" },
  RUPTURA: { label: "Ruptura", tone: "red" },
};
type Props = {
  visibleRows: StockOverviewData["rows"];
  showAlerts: boolean;
  productOptions: Pick<
    ProductFormProps,
    "categories" | "brands" | "warehouses" | "suppliers"
  >;
};

export function StockProductsTable({
  visibleRows,
  showAlerts,
  productOptions,
}: Props) {
  const [selected, setSelected] = useState<
    StockOverviewData["rows"][number] | null
  >(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const remove = (id: string) => {
    if (window.confirm("Excluir este produto?"))
      startTransition(async () => {
        await deleteProduct(id);
        router.refresh();
      });
  };
  return (
    <Card className="fade-up overflow-hidden p-6 pb-3">
      <SectionTitle
        icon={<Package size={17} />}
        title={
          showAlerts ? "Itens que precisam de atenção" : "Posição de estoque"
        }
      />
      <div className="-mx-6 mt-4 overflow-x-auto">
        <table className="tbl min-w-[1080px]">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Físico</th>
              <th>Reservado</th>
              <th>Disponível</th>
              <th>Mínimo</th>
              <th>Status</th>
              <th>Custo médio</th>
              <th>Preço venda</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((p) => {
              const st = statusMap[p.status];
              return (
                <tr
                  key={p.id}
                  onDoubleClick={() => setSelected(p)}
                  className="cursor-pointer"
                >
                  <td>
                    <div className="font-extrabold">{p.name}</div>
                    <div className="text-xs text-ink-300">
                      {p.sku} · {p.unit}
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>{p.stock}</td>
                  <td>{p.reserved || "—"}</td>
                  <td>{p.available}</td>
                  <td>{p.minStock}</td>
                  <td>
                    <Badge tone={st.tone}>{st.label}</Badge>
                  </td>
                  <td>{brl(n(p.avgCost))}</td>
                  <td>{brl(n(p.salePrice))}</td>
                  <td>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        className="!p-2"
                        title="Editar"
                        onClick={() => setSelected(p)}
                      >
                        <Pencil size={15} />
                      </Button>
                      <Button
                        type="button"
                        className="!p-2 text-coral-500"
                        title="Excluir"
                        disabled={pending}
                        onClick={() => remove(p.id)}
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selected && (
        <Modal
          open
          title="Editar Produto"
          width="max-w-6xl"
          height="h-[90vh]"
          onClose={() => setSelected(null)}
        >
          <ProductForm
            {...productOptions}
            product={{ id: selected.id, values: selected.values }}
            onCancel={() => setSelected(null)}
            onSuccess={() => {
              setSelected(null);
              router.refresh();
            }}
          />
        </Modal>
      )}
    </Card>
  );
}

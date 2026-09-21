"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductSection } from "./product-section";
import { useProductLookup } from "./lookup/product-lookup-provider";

type Variant = { id: string; label: string; quantity: string; price: string };

export function PriceVariants() {
  const lookup = useProductLookup();
  const [rows, setRows] = useState<Variant[]>(() => {
    try { return JSON.parse(lookup.initial("priceVariants") || "[]") as Variant[]; } catch { return []; }
  });
  const update = (id: string, patch: Partial<Variant>) => setRows((current) => current.map((row) => row.id === id ? { ...row, ...patch } : row));
  return (
    <ProductSection title="Variações de preço" description="Ex.: atacado, instalador ou condição especial. Estas condições ficam na ficha exportada.">
      <Input type="hidden" name="priceVariants" value={JSON.stringify(rows)} />
      <div className="space-y-3">
        {rows.map((row, index) => (
          <div key={row.id} className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
            <Input aria-label={"Condição " + (index + 1)} placeholder="Nome da condição" required value={row.label} onChange={(event) => update(row.id, { label: event.target.value })} />
            <Input aria-label={"Quantidade mínima " + (index + 1)} placeholder="Quantidade mínima" type="number" min="0.001" step="0.001" required value={row.quantity} onChange={(event) => update(row.id, { quantity: event.target.value })} />
            <Input aria-label={"Preço em reais " + (index + 1)} placeholder="Preço (R$)" type="number" min="0" step="0.01" required value={row.price} onChange={(event) => update(row.id, { price: event.target.value })} />
            <Button variant="danger" aria-label={"Remover condição " + (index + 1)} onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}><Trash2 size={16} /></Button>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-ink-500">Nenhuma condição adicional.</p>}
        <Button onClick={() => setRows((current) => [...current, { id: crypto.randomUUID(), label: "", quantity: "1", price: "" }])}><Plus size={16} />Adicionar condição</Button>
      </div>
    </ProductSection>
  );
}

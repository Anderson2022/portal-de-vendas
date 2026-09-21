"use client";

import { useState } from "react";
import { Boxes, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductSection } from "../product-section";
import { useProductLookup } from "../lookup/product-lookup-provider";

type KitItem = { id: string; description: string; quantity: string; unit: string };

export function KitFields() {
  const lookup = useProductLookup();
  const [items, setItems] = useState<KitItem[]>(() => {
    try { return JSON.parse(lookup.initial("kitComponents") || "[]") as KitItem[]; } catch { return []; }
  });
  const update = (id: string, patch: Partial<KitItem>) => setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
  return (
    <ProductSection icon={<Boxes size={17} />} title="Composição do kit" description="Ficha dos componentes. O cadastro atual não movimenta automaticamente o estoque dos componentes.">
      <Input type="hidden" name="kitComponents" value={JSON.stringify(items)} />
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
            <Input aria-label={"Componente " + (index + 1)} placeholder="Código / descrição do componente" required value={item.description} onChange={(e) => update(item.id, { description: e.target.value })} />
            <Input aria-label={"Quantidade do componente " + (index + 1)} required type="number" min="0.001" step="0.001" value={item.quantity} onChange={(e) => update(item.id, { quantity: e.target.value })} />
            <Input aria-label={"Unidade do componente " + (index + 1)} required value={item.unit} onChange={(e) => update(item.id, { unit: e.target.value })} />
            <Button variant="danger" aria-label={"Remover componente " + (index + 1)} onClick={() => setItems((current) => current.filter((row) => row.id !== item.id))}><Trash2 size={16} /></Button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-ink-500">Nenhum componente informado.</p>}
        <Button onClick={() => setItems((current) => [...current, { id: crypto.randomUUID(), description: "", quantity: "1", unit: "UN" }])}><Plus size={16} />Adicionar componente</Button>
      </div>
    </ProductSection>
  );
}

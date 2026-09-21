"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

export type AdjustmentProduct = {
  id: string;
  name: string;
  sku: string;
  unit: string;
  stock: number;
  reserved: number;
  warehouseId: string;
};

export function AdjustmentProductPicker({ products, value, onChange }: {
  products: AdjustmentProduct[];
  value: AdjustmentProduct | null;
  onChange: (product: AdjustmentProduct) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rows = useMemo(() => products.filter((product) => `${product.name} ${product.sku}`.toLowerCase().includes(query.toLowerCase())), [products, query]);

  return <>
    <label className="space-y-1 text-sm font-semibold">
      <span>Produto</span>
      <div className="relative">
        <Input readOnly value={value ? `${value.sku ? `${value.sku} - ` : ""}${value.name}` : ""} placeholder="Pesquisar produto..." />
        <Button type="button" variant="unstyled" aria-label="Pesquisar produto" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setOpen(true)}><Search size={17} /></Button>
      </div>
    </label>
    {open && <Modal open title="Pesquisar produto" width="max-w-3xl" onClose={() => setOpen(false)}>
      <div className="space-y-4">
        <div className="relative"><Input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar por código ou descrição..." /><Search className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" size={17} /></div>
        <div className="overflow-hidden rounded-2xl border border-ink-100">
          <div className="grid grid-cols-[130px_1fr_100px] bg-white/50 px-4 py-3 text-xs font-extrabold"><span>CÓDIGO</span><span>PRODUTO</span><span>DISPONÍVEL</span></div>
          {rows.map((product) => <button type="button" key={product.id} className="grid w-full grid-cols-[130px_1fr_100px] border-t border-ink-100 px-4 py-3 text-left text-sm hover:bg-white/60" onDoubleClick={() => { onChange(product); setOpen(false); }} onClick={() => onChange(product)}><span>{product.sku || "—"}</span><span>{product.name}</span><span>{product.stock - product.reserved} {product.unit}</span></button>)}
          {!rows.length && <p className="p-5 text-sm text-ink-400">Nenhum produto encontrado.</p>}
        </div>
        <p className="text-xs text-ink-400">Clique duas vezes para selecionar e fechar.</p>
      </div>
    </Modal>}
  </>;
}

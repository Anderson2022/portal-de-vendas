"use client";
import { documentCode } from "@/lib/format";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Users, Package, FileText, ReceiptText, Wrench } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Group } from "./search-group";
import { Item } from "./search-item";
type Results = {
  customers: { id: string; name: string; city?: string }[];
  products: { id: string; name: string; sku: string }[];
  quotes: { number: string; project: string; customer?: string }[];
  sales: { number: string; customer?: string }[];
  workOrders: { number: string; customer?: string }[];
};
export function Palette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [res, setRes] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const deb = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);

  const search = (v: string) => {
    setQ(v);
    if (deb.current) clearTimeout(deb.current);
    if (v.trim().length < 2) {
      setRes(null);
      return;
    }
    setLoading(true);
    deb.current = setTimeout(async () => {
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(v)}`);
        setRes(await r.json());
      } finally {
        setLoading(false);
      }
    }, 220);
  };

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  if (!open) return null;
  const has =
    res && [...res.customers, ...res.products, ...res.quotes, ...res.sales, ...res.workOrders].length > 0;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[11vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-ink-950/25 backdrop-blur-[6px]" />
      <Card
        className="card fade-up relative w-full max-w-xl overflow-hidden !rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-ink-100/70 px-5 py-4">
          <Search size={18} className="text-water-600" />
          <Input
            ref={inputRef}
            value={q}
            onChange={(e) => search(e.target.value)}
            placeholder="Buscar clientes, pedidos, produtos, OS..."
            className="w-full bg-transparent text-[15px] font-medium text-ink-900 outline-none placeholder:text-ink-300"
          />
          <kbd className="rounded-lg bg-ink-100/60 px-2 py-1 text-[10px] font-bold text-ink-500">ESC</kbd>
        </div>
        <div className="max-h-[52vh] overflow-y-auto p-3">
          {!res && (
            <div className="px-4 py-8 text-center text-[13px] font-medium text-ink-300">
              Digite ao menos 2 caracteres para buscar em todo o sistema
            </div>
          )}
          {res && !has && !loading && (
            <div className="px-4 py-8 text-center text-[13px] font-medium text-ink-300">
              Nenhum resultado para “{q}”
            </div>
          )}
          {loading && <div className="px-4 py-3 text-[12px] font-semibold text-water-600">Buscando…</div>}
          {res?.customers.length ? (
            <Group icon={<Users size={14} />} label="Clientes">
              {res.customers.map((c) => (
                <Item key={c.id} title={c.name} sub={c.city} onClick={() => go("/clientes")} />
              ))}
            </Group>
          ) : null}
          {res?.products.length ? (
            <Group icon={<Package size={14} />} label="Produtos">
              {res.products.map((p) => (
                <Item key={p.id} title={p.name} sub={p.sku} onClick={() => go("/estoque")} />
              ))}
            </Group>
          ) : null}
          {res?.quotes.length ? (
            <Group icon={<FileText size={14} />} label="Orçamentos">
              {res.quotes.map((x) => (
                <Item key={x.number} title={`#${documentCode(x.number)} — ${x.project}`} sub={x.customer} onClick={() => go("/vendas/orcamentos")} />
              ))}
            </Group>
          ) : null}
          {res?.sales.length ? (
            <Group icon={<ReceiptText size={14} />} label="Vendas">
              {res.sales.map((x) => (
                <Item key={x.number} title={`Venda #${documentCode(x.number)}`} sub={x.customer} onClick={() => go(`/vendas/pedidos/${x.number}`)} />
              ))}
            </Group>
          ) : null}
          {res?.workOrders.length ? (
            <Group icon={<Wrench size={14} />} label="Ordens de serviço">
              {res.workOrders.map((x) => (
                <Item key={x.number} title={`OS #${documentCode(x.number)}`} sub={x.customer} onClick={() => go("/ordens-servico")} />
              ))}
            </Group>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

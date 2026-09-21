"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Notice } from "@/components/ui/notice";
import { createStockAdjustment } from "@/lib/estoque/create-stock-adjustment";
import { listStockLocations, listStockSites, listStockWarehouses, type StockStructureOption } from "@/lib/estoque/stock-structure";
import { AdjustmentProductPicker, type AdjustmentProduct } from "./adjustment-product-picker";
import { StockAdjustmentHistory, type AdjustmentHistoryItem } from "./stock-adjustment-history";

const reasons = ["Avaria", "Perda", "Vencimento", "Sobra de inventário", "Falta de inventário", "Erro de recebimento", "Erro de separação", "Conversão de unidade", "Correção documental", "Outro"];

export function StockAdjustmentModal({ products, history, onClose }: { products: AdjustmentProduct[]; history: AdjustmentHistoryItem[]; onClose: () => void }) {
  const [tab, setTab] = useState<"new" | "history">("new");
  const [product, setProduct] = useState<AdjustmentProduct | null>(null);
  const [sites, setSites] = useState<StockStructureOption[]>([]), [warehouses, setWarehouses] = useState<StockStructureOption[]>([]), [locations, setLocations] = useState<StockStructureOption[]>([]);
  const [siteId, setSiteId] = useState(""), [warehouseId, setWarehouseId] = useState(""), [locationId, setLocationId] = useState("");
  const [effect, setEffect] = useState<"ENTRY" | "EXIT">("EXIT"), [quantity, setQuantity] = useState(""), [reason, setReason] = useState(""), [document, setDocument] = useState(""), [notes, setNotes] = useState("");
  const [error, setError] = useState(""), [done, setDone] = useState(false), [pending, startTransition] = useTransition();
  const router = useRouter();
  useEffect(() => { void Promise.all([listStockSites(), listStockWarehouses()]).then(([siteRows, warehouseRows]) => { setSites(siteRows); setWarehouses(warehouseRows); }); }, []);
  useEffect(() => { setLocations([]); setLocationId(""); if (warehouseId) void listStockLocations(warehouseId).then(setLocations); }, [warehouseId]);
  const physical = product?.stock || 0, available = physical - (product?.reserved || 0), amount = Number(quantity) || 0;
  const after = useMemo(() => physical + (effect === "EXIT" ? -amount : amount), [physical, effect, amount]);
  const availableWarehouses = warehouses.filter((warehouse) => !siteId || String(warehouse.site_id || "") === siteId);

  function submit(event: React.FormEvent) {
    event.preventDefault(); setError(""); setDone(false);
    if (!product) return setError("Selecione o produto.");
    if (effect === "EXIT" && amount > available) return setError("A quantidade de saída é maior que o saldo disponível.");
    startTransition(async () => { try { await createStockAdjustment({ productId: product.id, warehouseId, locationId, effect, quantity: amount, reason, document, notes }); setDone(true); setQuantity(""); setNotes(""); router.refresh(); } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível registrar o ajuste."); } });
  }

  return <Modal open title="Ajustes de estoque" width="max-w-6xl" height="h-[88vh]" onClose={onClose}>
    <div className="mb-5 flex gap-2"><Button variant={tab === "new" ? "primary" : "secondary"} onClick={() => setTab("new")}>Novo ajuste</Button><Button variant={tab === "history" ? "primary" : "secondary"} onClick={() => setTab("history")}>Histórico</Button></div>
    {tab === "history" ? <StockAdjustmentHistory rows={history} /> : <form className="space-y-5" onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2"><AdjustmentProductPicker products={products} value={product} onChange={(selected) => { setProduct(selected); if (selected.warehouseId) setWarehouseId(selected.warehouseId); }} />
        <label className="space-y-1 text-sm font-semibold"><span>Unidade / estabelecimento</span><select className="input w-full" value={siteId} onChange={(event) => { setSiteId(event.target.value); setWarehouseId(""); }}><option value="">Selecione</option>{sites.map((site) => <option key={site.id} value={site.id}>{site.name}</option>)}</select></label>
        <label className="space-y-1 text-sm font-semibold"><span>Depósito</span><select className="input w-full" value={warehouseId} onChange={(event) => setWarehouseId(event.target.value)} required><option value="">Selecione</option>{availableWarehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}</select></label>
        <label className="space-y-1 text-sm font-semibold"><span>Localização</span><select className="input w-full" value={locationId} onChange={(event) => setLocationId(event.target.value)}><option value="">Sem localização</option>{locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}</select></label>
        <label className="space-y-1 text-sm font-semibold"><span>Lote</span><Input placeholder="Lote (quando aplicável)" /></label>
        <label className="space-y-1 text-sm font-semibold"><span>Tipo de ajuste</span><select className="input w-full" value={effect} onChange={(event) => setEffect(event.target.value as "ENTRY" | "EXIT")}><option value="ENTRY">Entrada</option><option value="EXIT">Saída</option></select></label>
      </div>
      <div className="grid gap-4 rounded-2xl bg-white/45 p-4 sm:grid-cols-3"><div><span className="text-xs font-bold text-ink-400">Saldo físico atual</span><strong className="block text-xl">{physical} {product?.unit || "UN"}</strong></div><div><span className="text-xs font-bold text-ink-400">Saldo disponível</span><strong className="block text-xl">{available} {product?.unit || "UN"}</strong></div><div><span className="text-xs font-bold text-ink-400">Saldo físico após ajuste</span><strong className="block text-xl">{after} {product?.unit || "UN"}</strong></div></div>
      <div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1 text-sm font-semibold"><span>Quantidade do ajuste</span><Input required type="number" min="0.001" step="0.001" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></label><label className="space-y-1 text-sm font-semibold"><span>Motivo</span><select required className="input w-full" value={reason} onChange={(event) => setReason(event.target.value)}><option value="">Selecione</option>{reasons.map((item) => <option key={item}>{item}</option>)}</select></label><label className="space-y-1 text-sm font-semibold"><span>Documento de origem</span><Input value={document} onChange={(event) => setDocument(event.target.value)} placeholder="Ex.: Inventário INV-000123" /></label><div className="rounded-xl bg-white/40 p-3 text-sm"><strong>Responsável:</strong><br />usuário autenticado</div></div>
      <label className="space-y-1 text-sm font-semibold"><span>Observação</span><textarea className="input min-h-24 w-full" value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
      {error && <Notice error>{error}</Notice>}{done && <Notice>Ajuste registrado e saldo atualizado.</Notice>}
      <div className="flex justify-end"><Button variant="primary" type="submit" disabled={pending}>{pending ? "Registrando..." : "Registrar ajuste"}</Button></div>
    </form>}
  </Modal>;
}

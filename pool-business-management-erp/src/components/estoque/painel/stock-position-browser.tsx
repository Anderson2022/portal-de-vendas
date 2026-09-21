"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  listStockBalances,
  listStockLocations,
  listStockSites,
  listStockWarehouses,
  type StockStructureOption,
} from "@/lib/estoque/stock-structure";
export function StockPositionBrowser() {
  const [sites, setSites] = useState<StockStructureOption[]>([]),
    [warehouses, setWarehouses] = useState<StockStructureOption[]>([]),
    [locations, setLocations] = useState<StockStructureOption[]>([]),
    [rows, setRows] = useState<StockStructureOption[]>([]),
    [site, setSite] = useState(""),
    [warehouse, setWarehouse] = useState(""),
    [location, setLocation] = useState(""),
    [product, setProduct] = useState("");
  useEffect(() => {
    void listStockSites().then(setSites);
  }, []);
  useEffect(() => {
    void listStockWarehouses(site || undefined).then(setWarehouses);
    setWarehouse("");
    setLocation("");
  }, [site]);
  useEffect(() => {
    setLocations([]);
    setLocation("");
    if (warehouse) void listStockLocations(warehouse).then(setLocations);
  }, [warehouse]);
  useEffect(() => {
    const timer = setTimeout(
      () =>
        void listStockBalances({
          siteId: site,
          warehouseId: warehouse,
          locationId: location,
          product,
        }).then(setRows),
      250,
    );
    return () => clearTimeout(timer);
  }, [site, warehouse, location, product]);
  return (
    <section className="mt-4 rounded-3xl bg-white/35 p-5 shadow-card">
      <h2 className="mb-4 font-bold">Posições de estoque</h2>
      <div className="grid gap-3 md:grid-cols-4">
        <select
          className="input"
          value={site}
          onChange={(e) => setSite(e.target.value)}
        >
          <option value="">Todas as unidades</option>
          {sites.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={warehouse}
          onChange={(e) => setWarehouse(e.target.value)}
        >
          <option value="">Todos os depósitos</option>
          {warehouses.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          disabled={!warehouse}
        >
          <option value="">Todas as localizações</option>
          {locations.map((x) => (
            <option key={x.id} value={x.id}>
              {x.path || x.name}
            </option>
          ))}
        </select>
        <div className="relative">
          <Input
            className="!pl-9"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Buscar produto..."
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2"
            size={15}
          />
        </div>
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl border">
        <div className="grid min-w-[900px] grid-cols-[1.4fr_1fr_1fr_90px_90px_90px_90px_90px] bg-white/50 px-4 py-3 text-xs font-bold uppercase">
          <span>Produto</span>
          <span>Unidade</span>
          <span>Localização</span>
          <span>Físico</span>
          <span>Reservado</span>
          <span>Bloqueado</span>
          <span>Disponível</span>
          <span>Trânsito</span>
        </div>
        {rows.map((row) => (
          <div
            key={row.id}
            className="grid min-w-[900px] grid-cols-[1.4fr_1fr_1fr_90px_90px_90px_90px_90px] border-t px-4 py-3 text-sm"
          >
            <span>
              {row.product}
              <small className="block text-ink-400">{row.sku}</small>
            </span>
            <span>
              {row.site}
              <small className="block text-ink-400">{row.warehouse}</small>
            </span>
            <span>{row.location}</span>
            <span>{row.physical}</span>
            <span>{row.reserved}</span>
            <span>{row.blocked}</span>
            <strong>{row.available}</strong>
            <span>{row.in_transit}</span>
          </div>
        ))}
        {!rows.length && (
          <p className="p-5 text-sm text-ink-400">Nenhum saldo encontrado.</p>
        )}
      </div>
    </section>
  );
}

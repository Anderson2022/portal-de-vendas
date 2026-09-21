"use client";
import { useEffect, useMemo, useState } from "react";
import { WarehouseAddressFormModal } from "./warehouse-address-form-modal";
import { listWarehouseAddressTree } from "@/lib/estoque/warehouse-address";
import { Plus, Search } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createStockLocation,
  createStockSite,
  createStockWarehouse,
  listStockLocations,
  listStockSites,
  listStockWarehouses,
  updateStockLocation,
  updateStockSite,
  updateStockWarehouse,
  type StockStructureOption,
} from "@/lib/estoque/stock-structure";
export type StructureKind = "site" | "warehouse" | "location";
const titles = {
  site: "Unidade / estabelecimento",
  warehouse: "Depósito",
  location: "Localização",
};
export function StockStructureRegistrationModal({
  kind,
  onClose,
}: {
  kind: StructureKind;
  onClose: () => void;
}) {
  const [rows, setRows] = useState<StockStructureOption[]>([]),
    [sites, setSites] = useState<StockStructureOption[]>([]),
    [warehouses, setWarehouses] = useState<StockStructureOption[]>([]),
    [site, setSite] = useState(""),
    [warehouse, setWarehouse] = useState(""),
    [query, setQuery] = useState(""),
    [view, setView] = useState<"tree" | "list">("tree"),
    [form, setForm] = useState<StockStructureOption | null | undefined>(
      undefined,
    );
  const load = async () => {
    setSites(await listStockSites());
    if (kind === "site") setRows(await listStockSites());
    else if (kind === "warehouse")
      setRows(await listStockWarehouses(site || undefined));
    else if (warehouse) setRows(await listWarehouseAddressTree(warehouse));
    else setRows([]);
  };
  useEffect(() => {
    void load();
  }, [kind, site, warehouse]);
  useEffect(() => {
    if (!site) {
      setWarehouses([]);
      setWarehouse("");
      return;
    }
    void listStockWarehouses(site).then(setWarehouses);
  }, [site]);
  const filtered = useMemo(
      () =>
        rows.filter((r) =>
          `${r.id} ${r.code || ""} ${r.name}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        ),
      [rows, query],
    ),
    ready = kind === "site" || (kind === "warehouse" ? !!site : !!warehouse);
  return (
    <>
      <Modal
        open
        title={titles[kind]}
        width="max-w-4xl"
        height="h-[75vh]"
        onClose={onClose}
      >
        <div className="space-y-4">
          {kind !== "site" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                className="input"
                value={site}
                onChange={(e) => {
                  setSite(e.target.value);
                  setWarehouse("");
                }}
              >
                <option value="">Selecione a unidade / estabelecimento</option>
                {sites.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.code} - {x.name}
                  </option>
                ))}
              </select>
              {kind === "location" && (
                <select
                  className="input"
                  value={warehouse}
                  onChange={(e) => setWarehouse(e.target.value)}
                  disabled={!site}
                >
                  <option value="">Selecione o depósito</option>
                  {warehouses.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.code} - {x.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
          {kind === "location" && (
            <div className="flex gap-2">
              <Button onClick={() => setView("tree")}>Visão em árvore</Button>
              <Button onClick={() => setView("list")}>Lista</Button>
            </div>
          )}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Input
                className="!pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar por código ou descrição..."
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2"
                size={16}
              />
            </div>
            <Button
              variant="primary"
              disabled={!ready}
              onClick={() => setForm(null)}
            >
              <Plus size={16} />
              Cadastrar
            </Button>
          </div>
          <p className="text-xs text-ink-400">
            Clique duas vezes em um registro para editar.
          </p>
          <div className="overflow-hidden rounded-2xl border">
            <div className="grid grid-cols-[90px_180px_1fr] bg-white/50 px-4 py-3 text-xs font-bold uppercase">
              <span>ID</span>
              <span>Código</span>
              <span>Descrição</span>
            </div>
            {filtered.map((row) => (
              <button
                type="button"
                key={`${row.tipo || "location"}-${row.id}`}
                onDoubleClick={() => setForm(row)}
                className="grid w-full grid-cols-[90px_180px_1fr] border-t px-4 py-3 text-left text-sm hover:bg-white/60"
              >
                <span>{row.id}</span>
                <span>{row.code || "—"}</span>
                <span
                  style={{
                    paddingLeft:
                      view === "tree" ? `${Number(row.depth || 0) * 20}px` : 0,
                  }}
                >
                  {view === "tree" ? (row.depth ? "↳ " : "▼ ") : ""}
                  {row.name}
                </span>
              </button>
            ))}
            {!filtered.length && (
              <p className="p-5 text-sm text-ink-400">
                Nenhum registro encontrado.
              </p>
            )}
          </div>
        </div>
      </Modal>
      {form !== undefined &&
        (kind === "location" ? (
          <WarehouseAddressFormModal
            warehouse={warehouse}
            record={form}
            onClose={() => setForm(undefined)}
            onSaved={load}
          />
        ) : (
          <StructureForm
            kind={kind}
            site={site}
            warehouse={warehouse}
            locations={rows}
            record={form}
            onClose={() => setForm(undefined)}
            onSaved={async () => {
              setForm(undefined);
              await load();
            }}
          />
        ))}
    </>
  );
}
function StructureForm({
  kind,
  site,
  warehouse,
  locations,
  record,
  onClose,
  onSaved,
}: {
  kind: StructureKind;
  site: string;
  warehouse: string;
  locations: StockStructureOption[];
  record: StockStructureOption | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [data, setData] = useState<Record<string, string>>({
      code: record?.code || "",
      name: record?.name || "",
      type: record?.tipo || (kind === "location" ? "POSICAO" : ""),
      city: record?.cidade || "",
      uf: record?.uf || "",
      description: record?.description || "",
      active: String(record?.active !== false),
    }),
    [busy, setBusy] = useState(false),
    set = (key: string, value: string) =>
      setData((d) => ({ ...d, [key]: value }));
  const save = async () => {
    setBusy(true);
    try {
      if (record) {
        if (kind === "site")
          await updateStockSite(record.id, data.code, data.name, data);
        else if (kind === "warehouse")
          await updateStockWarehouse(
            record.id,
            site,
            data.code,
            data.name,
            data,
          );
        else
          await updateStockLocation(
            record.id,
            warehouse,
            data.code,
            data.name,
            data,
          );
      } else if (kind === "site")
        await createStockSite(data.code, data.name, data);
      else if (kind === "warehouse")
        await createStockWarehouse(site, data.code, data.name, data);
      else await createStockLocation(warehouse, data.code, data.name, data);
      await onSaved();
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      open
      title={`${record ? "Editar" : "Cadastrar"} ${titles[kind]}`}
      width="max-w-3xl"
      onClose={onClose}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          value={data.code}
          placeholder="Código (automático se vazio)"
          onChange={(e) => set("code", e.target.value)}
        />
        <Input
          value={data.name}
          placeholder="Nome / descrição"
          onChange={(e) => set("name", e.target.value)}
        />
        {kind === "site" && (
          <>
            <Input
              placeholder="Cidade"
              value={data.city}
              onChange={(e) => set("city", e.target.value)}
            />
            <Input
              placeholder="UF"
              value={data.uf}
              maxLength={2}
              onChange={(e) => set("uf", e.target.value)}
            />
            <Input
              className="sm:col-span-2"
              placeholder="Descrição da unidade / estabelecimento"
              value={data.description}
              onChange={(e) => set("description", e.target.value)}
            />
            <label className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                checked={data.active === "true"}
                onChange={(e) => set("active", String(e.target.checked))}
              />{" "}
              Unidade ativa
            </label>
          </>
        )}
        {kind === "warehouse" && (
          <>
            <Input
              placeholder="Tipo do depósito"
              onChange={(e) => set("type", e.target.value)}
            />
            <Input
              placeholder="Descrição"
              onChange={(e) => set("description", e.target.value)}
            />
          </>
        )}
        {kind === "location" && (
          <>
            <select
              className="input"
              value={data.type}
              onChange={(e) => set("type", e.target.value)}
            >
              {["RUA", "ESTANTE", "VAO", "NIVEL", "POSICAO"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
            <select
              className="input"
              onChange={(e) => set("parentId", e.target.value)}
            >
              <option value="">Sem localização pai</option>
              {locations
                .filter((x) => x.id !== record?.id)
                .map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
            </select>
            {[
              ["shelf", "Prateleira"],
              ["column", "Coluna"],
              ["row", "Linha"],
              ["position", "Posição"],
              ["capacity", "Capacidade"],
              ["notes", "Observação"],
            ].map(([key, label]) => (
              <Input
                key={key}
                placeholder={label}
                onChange={(e) => set(key, e.target.value)}
              />
            ))}
          </>
        )}
        <div className="flex justify-end sm:col-span-2">
          <Button
            variant="primary"
            disabled={busy || !data.name}
            onClick={save}
          >
            {record ? "Salvar alterações" : "Cadastrar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

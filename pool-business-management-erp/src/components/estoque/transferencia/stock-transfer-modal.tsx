"use client";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createStockTransfer,
  createTransferLocation,
  createTransferReason,
  getTransferProductInfo,
  getTransferProductOrigin,
  getTransferReasons,
  type TransferItem,
} from "@/lib/estoque/create-stock-transfer";
import { listInventoryLocations } from "@/lib/estoque/inventory-process";
import {
  listStockSites,
  listStockWarehouses,
  type StockStructureOption,
} from "@/lib/estoque/stock-structure";
import type { Option } from "../produto/product-types";
import {
  TransferLookupField,
  type TransferLookupOption,
} from "./transfer-lookup-field";
type Product = Option & {
  sku: string;
  unitId: string;
  unitName: string;
  warehouseId: string;
  available: number;
};
type Info = Awaited<ReturnType<typeof getTransferProductInfo>>;
type Row = TransferItem & {
  factor: number;
  baseQuantity: number;
  unitName: string;
};
const blank: TransferItem = {
  productId: "",
  unitId: "",
  quantity: "",
  originLocationId: "",
  destinationLocationId: "",
  lot: "",
  expiration: "",
  serialNumber: "",
  notes: "",
};
export function StockTransferModal({
  products,
  warehouses,
  onClose,
}: {
  products: Product[];
  warehouses: Option[];
  onClose: () => void;
}) {
  const [origin, setOrigin] = useState(""),
    [destination, setDestination] = useState(""),
    [originSite, setOriginSite] = useState(""),
    [destinationSite, setDestinationSite] = useState(""),
    [reason, setReason] = useState(""),
    [reasons, setReasons] = useState<Array<{ code: string; name: string }>>([]),
    [notes, setNotes] = useState(""),
    [draft, setDraft] = useState(blank),
    [items, setItems] = useState<Row[]>([]),
    [info, setInfo] = useState<Info | null>(null),
    [sites, setSites] = useState<StockStructureOption[]>([]),
    [structureWarehouses, setStructureWarehouses] = useState<
      StockStructureOption[]
    >([]),
    [originLocations, setOriginLocations] = useState<Option[]>([]),
    [destinationLocations, setDestinationLocations] = useState<Option[]>([]),
    [suggestedLocation, setSuggestedLocation] = useState(""),
    [error, setError] = useState(""),
    [pending, start] = useTransition();
  const loadReasons = () => getTransferReasons().then(setReasons);
  const loadLocations = async (id: string, setter: (rows: Option[]) => void) =>
    setter(
      (await listInventoryLocations(id)).map((x) => ({
        id: String(x.id),
        name: x.name,
        code: x.codigo,
      })),
    );
  useEffect(() => {
    void loadReasons();
    void Promise.all([listStockSites(), listStockWarehouses()]).then(
      ([siteRows, warehouseRows]) => {
        setSites(siteRows);
        setStructureWarehouses(warehouseRows);
      },
    );
  }, []);
  useEffect(() => {
    const selected = structureWarehouses.find((x) => String(x.id) === origin);
    if (selected?.site_id) setOriginSite(String(selected.site_id));
  }, [origin, structureWarehouses]);
  useEffect(() => {
    const selected = structureWarehouses.find(
      (x) => String(x.id) === destination,
    );
    if (selected?.site_id) setDestinationSite(String(selected.site_id));
  }, [destination, structureWarehouses]);
  useEffect(() => {
    setDraft((d) => ({ ...d, originLocationId: "" }));
    setOriginLocations([]);
    if (origin)
      void listInventoryLocations(origin).then((rows) => {
        setOriginLocations(
          rows.map((x) => ({ id: String(x.id), name: x.name, code: x.codigo })),
        );
        if (suggestedLocation)
          setDraft((d) => ({ ...d, originLocationId: suggestedLocation }));
      });
  }, [origin, suggestedLocation]);
  useEffect(() => {
    setDraft((d) => ({ ...d, destinationLocationId: "" }));
    setDestinationLocations([]);
    if (destination) void loadLocations(destination, setDestinationLocations);
  }, [destination]);
  useEffect(() => {
    setInfo(null);
    if (draft.productId && origin)
      void getTransferProductInfo(draft.productId, origin).then((data) => {
        setInfo(data);
        const base = data.conversions.find((x) => x.unidade_base);
        setDraft((d) => ({ ...d, unitId: String(base?.unit_id || d.unitId) }));
      });
  }, [draft.productId, origin]);
  const conversion = info?.conversions.find(
      (x) => String(x.unit_id) === draft.unitId,
    ),
    factor = Number(conversion?.factor || 1),
    baseQuantity = useMemo(
      () => Number(draft.quantity || 0) * factor,
      [draft.quantity, factor],
    );
  const productOptions: TransferLookupOption[] = products.map((x) => ({
      id: x.id,
      name: x.name,
      code: x.sku,
      unit: x.unitName,
      warehouse:
        warehouses.find((w) => w.id === x.warehouseId)?.name || "Não definido",
      available: x.available,
    })),
    reasonOptions: TransferLookupOption[] = reasons.map((x) => ({
      id: x.code,
      code: x.code,
      name: x.name,
    })),
    unitOptions: TransferLookupOption[] = (info?.conversions || []).map(
      (x) => ({ id: String(x.unit_id), code: x.sigla, name: x.name }),
    );
  const add = () => {
    if (
      !draft.productId ||
      !draft.unitId ||
      Number(draft.quantity) <= 0 ||
      baseQuantity > Number(info?.available || 0)
    ) {
      setError("Revise a quantidade e o saldo disponÃ­vel.");
      return;
    }
    setError("");
    setItems((c) => [
      ...c,
      {
        ...draft,
        factor,
        baseQuantity,
        unitName: conversion?.sigla || draft.unitId,
      },
    ]);
    setDraft(blank);
    setInfo(null);
  };
  const submit = (requestNow: boolean) =>
    start(async () => {
      try {
        setError("");
        await createStockTransfer({
          originWarehouseId: origin,
          destinationWarehouseId: destination,
          reason,
          notes,
          requestNow,
          items,
        });
        onClose();
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "NÃ£o foi possÃ­vel salvar a transferÃªncia.",
        );
      }
    });
  const location = (list: Option[], id?: string) =>
    list.find((x) => x.id === id)?.name || "â€”";
  return (
    <Modal
      open
      title="Nova TransferÃªncia"
      width="max-w-6xl"
      height="h-[88vh]"
      onClose={onClose}
    >
      <div className="space-y-5">
        <section className="grid gap-4 rounded-2xl border bg-white/40 p-4 sm:grid-cols-2">
          <WarehouseField
            label="Unidade de origem"
            value={originSite}
            options={sites.map((x) => ({ id: String(x.id), name: x.name }))}
            onChange={(id) => {
              setOriginSite(id);
              setOrigin("");
            }}
          />
          <WarehouseField
            label="Depósito de origem"
            value={origin}
            options={structureWarehouses
              .filter((x) => String(x.site_id) === originSite)
              .map((x) => ({ id: String(x.id), name: x.name }))}
            onChange={setOrigin}
          />
          <WarehouseField
            label="Unidade de destino"
            value={destinationSite}
            options={sites.map((x) => ({ id: String(x.id), name: x.name }))}
            onChange={(id) => {
              setDestinationSite(id);
              setDestination("");
            }}
          />
          <WarehouseField
            label="Depósito de destino"
            value={destination}
            options={structureWarehouses
              .filter(
                (x) =>
                  String(x.site_id) === destinationSite &&
                  String(x.id) !== origin,
              )
              .map((x) => ({ id: String(x.id), name: x.name }))}
            onChange={setDestination}
          />
          <TransferLookupField
            label="Motivo"
            value={reason}
            options={reasonOptions}
            onSelect={setReason}
            onCreate={async (code, name) => {
              await createTransferReason(code, name);
              await loadReasons();
              setReason(code.toUpperCase());
            }}
          />
          <div className="rounded-xl bg-white/50 p-3 text-sm">
            <strong>UsuÃ¡rio:</strong> usuÃ¡rio autenticado
          </div>
        </section>
        <section className="grid gap-3 rounded-2xl border bg-white/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <TransferLookupField
              label="Produto"
              value={draft.productId}
              options={productOptions}
              onSelect={(productId) => {
                const product = products.find((item) => item.id === productId);
                setDraft({
                  ...blank,
                  productId,
                  unitId: product?.unitId || "",
                });
                void getTransferProductOrigin(productId).then((result) => {
                  const warehouseId = String(
                    result.warehouse_id || product?.warehouseId || "",
                  );
                  setSuggestedLocation(String(result.location_id || ""));
                  if (warehouseId) setOrigin(warehouseId);
                });
              }}
            />
          </div>
          <TransferLookupField
            label="LocalizaÃ§Ã£o origem"
            value={draft.originLocationId || ""}
            options={originLocations}
            disabled={!origin}
            onSelect={(id) => setDraft({ ...draft, originLocationId: id })}
            onCreate={async (code, name) => {
              await createTransferLocation(origin, code, name);
              await loadLocations(origin, setOriginLocations);
            }}
          />
          <TransferLookupField
            label="LocalizaÃ§Ã£o destino"
            value={draft.destinationLocationId || ""}
            options={destinationLocations}
            disabled={!destination}
            onSelect={(id) => setDraft({ ...draft, destinationLocationId: id })}
            onCreate={async (code, name) => {
              await createTransferLocation(destination, code, name);
              await loadLocations(destination, setDestinationLocations);
            }}
          />
          <TransferLookupField
            label="Unidade"
            value={draft.unitId}
            options={unitOptions}
            disabled={!draft.productId}
            onSelect={(unitId) => setDraft({ ...draft, unitId })}
          />
          <label className="space-y-1 text-sm font-semibold">
            <span>Quantidade</span>
            <Input
              type="number"
              min="0.000001"
              step="0.000001"
              value={draft.quantity}
              onChange={(e) => setDraft({ ...draft, quantity: e.target.value })}
            />
          </label>
          <div className="text-sm">
            <strong>Saldo disponÃ­vel</strong>
            <p>{info?.available ?? "â€”"}</p>
          </div>
          <div className="text-sm">
            <strong>ConversÃ£o</strong>
            <p>
              {conversion ? `1 ${conversion.sigla} = ${factor} base` : "â€”"}
            </p>
            <strong>Quantidade base</strong>
            <p>{baseQuantity || 0}</p>
          </div>
          {info?.product.controla_lote && (
            <Input
              value={draft.lot}
              onChange={(e) => setDraft({ ...draft, lot: e.target.value })}
              placeholder="Lote"
            />
          )}
          {info?.product.controla_validade && (
            <Input
              type="date"
              value={draft.expiration}
              onChange={(e) =>
                setDraft({ ...draft, expiration: e.target.value })
              }
            />
          )}{" "}
          {info?.product.controla_serie && (
            <Input
              value={draft.serialNumber}
              onChange={(e) =>
                setDraft({ ...draft, serialNumber: e.target.value })
              }
              placeholder="NÃºmero de sÃ©rie"
            />
          )}
          <Button onClick={add}>
            <Plus size={16} />
            Adicionar item
          </Button>
        </section>
        <section className="overflow-x-auto rounded-2xl border">
          <div className="grid min-w-[900px] grid-cols-[1.5fr_1fr_1fr_90px_80px_110px_1fr_50px] bg-white/50 px-4 py-3 text-xs font-bold uppercase">
            <span>Produto</span>
            <span>Origem</span>
            <span>Destino</span>
            <span>Unid.</span>
            <span>Qtd.</span>
            <span>Qtd. base</span>
            <span>Lote/sÃ©rie</span>
            <span />
          </div>
          {items.map((x, i) => (
            <div
              key={i}
              className="grid min-w-[900px] grid-cols-[1.5fr_1fr_1fr_90px_80px_110px_1fr_50px] items-center border-t px-4 py-3 text-sm"
            >
              <span>{products.find((p) => p.id === x.productId)?.name}</span>
              <span>{location(originLocations, x.originLocationId)}</span>
              <span>
                {location(destinationLocations, x.destinationLocationId)}
              </span>
              <span>{x.unitName}</span>
              <span>{x.quantity}</span>
              <span>{x.baseQuantity}</span>
              <span>{x.lot || x.serialNumber || "â€”"}</span>
              <button
                className="text-coral-500"
                onClick={() => setItems((c) => c.filter((_, n) => n !== i))}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </section>
        <label className="space-y-1 text-sm font-semibold">
          <span>ObservaÃ§Ãµes</span>
          <Textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        {error && <p className="text-coral-500">{error}</p>}
        <div className="flex justify-end gap-3">
          <Button
            disabled={
              pending || !origin || !destination || !reason || !items.length
            }
            onClick={() => submit(false)}
          >
            Salvar rascunho
          </Button>
          <Button
            variant="primary"
            disabled={
              pending || !origin || !destination || !reason || !items.length
            }
            onClick={() => submit(true)}
          >
            Solicitar transferÃªncia
          </Button>
        </div>
      </div>
    </Modal>
  );
}
function WarehouseField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (id: string) => void;
}) {
  return (
    <label className="space-y-1 text-sm font-semibold">
      <span>{label}</span>
      <select
        className="input w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Selecione</option>
        {options.map((x) => (
          <option key={x.id} value={x.id}>
            {x.name}
          </option>
        ))}
      </select>
    </label>
  );
}

"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  approveInventory,
  cancelInventory,
  countInventoryItem,
  createInventory,
  getInventory,
  listInventories,
  listInventoryLocations,
  type InventoryListItem,
} from "@/lib/estoque/inventory-process";
import { listProductReferences } from "@/lib/estoque/product-references";
import { listStockWarehouses } from "@/lib/estoque/stock-structure";
import type { Option } from "../produto/product-types";
import { InventoryScopeFields } from "./inventory-scope-fields";
import { InventoryList } from "./inventory-list";
type Detail = {
  inventory: Record<string, unknown>;
  items: Array<Record<string, unknown>>;
};
export function InventoryModal({
  products,
  warehouses,
  onClose,
}: {
  products: Option[];
  warehouses: Option[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"list" | "new">("list"),
    [inventories, setInventories] = useState<InventoryListItem[]>([]),
    [type, setType] = useState("ROTATIVO"),
    [warehouse, setWarehouse] = useState(""),
    [availableWarehouses, setAvailableWarehouses] =
      useState<Option[]>(warehouses),
    [selected, setSelected] = useState<string[]>([]),
    [category, setCategory] = useState(""),
    [location, setLocation] = useState(""),
    [lot, setLot] = useState(""),
    [categories, setCategories] = useState<Option[]>([]),
    [locations, setLocations] = useState<Option[]>([]),
    [blind, setBlind] = useState(true),
    [doubleCount, setDouble] = useState(true),
    [block, setBlock] = useState(true),
    [notes, setNotes] = useState(""),
    [detail, setDetail] = useState<Detail | null>(null),
    [counts, setCounts] = useState<Record<string, string>>({}),
    [error, setError] = useState(""),
    [confirmCancel, setConfirmCancel] = useState(false),
    [cancelReason, setCancelReason] = useState(""),
    [pending, start] = useTransition();
  useEffect(() => {
    void listProductReferences("category")
      .then(setCategories)
      .catch(() => setCategories([]));
    void listInventories()
      .then(setInventories)
      .catch(() => setInventories([]));
    void listStockWarehouses()
      .then((rows) =>
        setAvailableWarehouses(
          rows.map((item) => ({
            id: String(item.id),
            name: item.code ? `${item.code} - ${item.name}` : item.name,
          })),
        ),
      )
      .catch(() => setAvailableWarehouses(warehouses));
  }, [warehouses]);
  useEffect(() => {
    setLocation("");
    setLocations([]);
    if (warehouse)
      void listInventoryLocations(warehouse)
        .then((rows) =>
          setLocations(
            rows.map((item) => ({
              id: String(item.id),
              name: `${item.codigo} - ${item.name}`,
            })),
          ),
        )
        .catch(() => setLocations([]));
  }, [warehouse]);
  const refresh = async (id: number) => setDetail(await getInventory(id));
  const create = () =>
    start(async () => {
      try {
        setError("");
        const result = await createInventory({
          type,
          warehouseId: warehouse,
          blind,
          doubleCount,
          blockMovements: block,
          notes,
          productIds: selected,
          categoryId: category || null,
          locationId: location || null,
          lot: lot || null,
        });
        await refresh(result.id);
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "NÃ£o foi possÃ­vel criar o inventÃ¡rio.",
        );
      }
    });
  const count = (item: Record<string, unknown>) =>
    start(async () => {
      try {
        await countInventoryItem(
          Number(detail!.inventory.id),
          Number(item.id),
          counts[String(item.id)] || "0",
          "",
        );
        await refresh(Number(detail!.inventory.id));
        router.refresh();
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "NÃ£o foi possÃ­vel registrar a contagem.",
        );
      }
    });
  const approve = () =>
    start(async () => {
      try {
        await approveInventory(
          Number(detail!.inventory.id),
          "DivergÃªncia de inventÃ¡rio",
          notes,
        );
        await refresh(Number(detail!.inventory.id));
        router.refresh();
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "NÃ£o foi possÃ­vel concluir.",
        );
      }
    });
  const cancel = () =>
    start(async () => {
      try {
        setError("");
        await cancelInventory(Number(detail!.inventory.id), cancelReason);
        await refresh(Number(detail!.inventory.id));
        setConfirmCancel(false);
        setInventories(await listInventories());
        router.refresh();
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Não foi possível cancelar o inventário.",
        );
      }
    });
  const scopeValid =
    type === "GERAL" ||
    (type === "CATEGORIA"
      ? !!category
      : type === "LOCALIZACAO"
        ? !!location
        : type === "LOTE"
          ? selected.length > 0 && !!lot
          : selected.length > 0);
  return (
    <Modal
      open
      title={detail ? String(detail.inventory.numero) : "Novo InventÃ¡rio"}
      width="max-w-6xl"
      height={confirmCancel ? undefined : "h-[88vh]"}
      onClose={() => (confirmCancel ? setConfirmCancel(false) : onClose())}
    >
      {confirmCancel ? (
        <div className="space-y-4">
          <p className="text-sm">
            O cancelamento encerrará o inventário e liberará as movimentações
            dos produtos bloqueados. Nenhum saldo será alterado.
          </p>
          <label className="block space-y-2 text-sm font-semibold">
            <span>Motivo do cancelamento</span>
            <Input
              autoFocus
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Informe o motivo"
            />
          </label>
          <div className="flex flex-wrap justify-end gap-3 pt-3">
            <Button variant="secondary" onClick={() => setConfirmCancel(false)}>
              Voltar
            </Button>
            <Button
              variant="primary"
              disabled={pending || !cancelReason.trim()}
              onClick={cancel}
            >
              {pending ? "Cancelando..." : "Confirmar cancelamento"}
            </Button>
          </div>
        </div>
      ) : !detail && mode === "list" ? (
        <InventoryList
          inventories={inventories}
          onCreate={() => setMode("new")}
          onOpen={(id) => void refresh(id)}
        />
      ) : !detail ? (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm font-semibold">
              <span>Tipo</span>
              <select
                className="input w-full"
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setSelected([]);
                  setCategory("");
                  setLocation("");
                  setLot("");
                }}
              >
                {[
                  "GERAL",
                  "ROTATIVO",
                  "PRODUTO",
                  "LOCALIZACAO",
                  "CATEGORIA",
                  "LOTE",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm font-semibold">
              <span>DepÃ³sito</span>
              <select
                className="input w-full"
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
              >
                <option value="">Selecione</option>
                {availableWarehouses.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="rounded-xl bg-white/40 p-3 text-sm sm:col-span-2">
              <strong>ResponsÃ¡vel:</strong> usuÃ¡rio logado
            </div>
          </div>
          <InventoryScopeFields
            type={type}
            products={products}
            selected={selected}
            onSelected={setSelected}
            categories={categories}
            categoryId={category}
            onCategory={setCategory}
            locations={locations}
            locationId={location}
            onLocation={setLocation}
            lot={lot}
            onLot={setLot}
          />
          <div className="grid gap-3">
            {[
              [
                blind,
                setBlind,
                "InventÃ¡rio cego",
                "Quem conta nÃ£o vÃª o saldo esperado.",
              ],
              [
                doubleCount,
                setDouble,
                "Dupla contagem",
                "Exige uma segunda contagem.",
              ],
              [
                block,
                setBlock,
                "Bloquear movimentaÃ§Ãµes",
                "Bloqueia somente produtos e depÃ³sito deste inventÃ¡rio.",
              ],
            ].map(([value, setter, label, help]) => (
              <label
                key={String(label)}
                className="flex items-start gap-2 text-sm"
              >
                <input
                  className="mt-1"
                  type="checkbox"
                  checked={Boolean(value)}
                  onChange={(e) =>
                    (setter as (v: boolean) => void)(e.target.checked)
                  }
                />
                <span>
                  <strong>{String(label)}</strong>
                  <small className="block text-ink-400">{String(help)}</small>
                </span>
              </label>
            ))}
          </div>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="ObservaÃ§Ãµes"
          />
          {error && <p className="text-coral-500">{error}</p>}
          <div className="flex justify-end">
            <Button
              variant="primary"
              disabled={pending || !warehouse || !scopeValid}
              onClick={create}
            >
              Gerar inventÃ¡rio
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-4 text-sm">
            <strong>Status: {String(detail.inventory.status)}</strong>
            <span>
              {detail.inventory.inventario_cego
                ? "Contagem cega"
                : "Saldo visÃ­vel"}
            </span>
          </div>
          {detail.items.map((item) => {
            const counted = item.quantidade_aprovada != null;
            return (
              <div
                key={String(item.id)}
                className="grid items-end gap-3 rounded-2xl border p-4 sm:grid-cols-[1fr_150px_150px_auto]"
              >
                <div>
                  <strong>{String(item.produto)}</strong>
                  {(!detail.inventory.inventario_cego || counted) && (
                    <p className="text-sm">
                      Saldo do sistema: {String(item.saldo_sistema)}{" "}
                      {String(item.unidade || "")}
                    </p>
                  )}
                  <p className="text-xs text-ink-400">
                    {String(item.status_item)}
                  </p>
                </div>
                <label className="space-y-1 text-sm">
                  <span>
                    {counted && detail.inventory.dupla_contagem
                      ? "Recontagem"
                      : "Quantidade contada"}
                  </span>
                  <Input
                    type="number"
                    min="0"
                    step="0.001"
                    value={counts[String(item.id)] || ""}
                    onChange={(e) =>
                      setCounts((c) => ({
                        ...c,
                        [String(item.id)]: e.target.value,
                      }))
                    }
                  />
                </label>
                <div className="text-sm">
                  {counted && (
                    <>
                      Contado: {String(item.quantidade_aprovada)}
                      <br />
                      DivergÃªncia: <strong>{String(item.divergencia)}</strong>
                    </>
                  )}
                </div>
                <Button
                  disabled={pending || !counts[String(item.id)]}
                  onClick={() => count(item)}
                >
                  Confirmar
                </Button>
              </div>
            );
          })}
          {error && <p className="text-coral-500">{error}</p>}
          <div className="flex justify-between gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setDetail(null);
                setMode("list");
              }}
            >
              Voltar para a lista
            </Button>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                disabled={
                  pending ||
                  ["CONCLUIDO", "CANCELADO"].includes(
                    String(detail.inventory.status),
                  )
                }
                onClick={() => setConfirmCancel(true)}
              >
                Cancelar inventário
              </Button>
              <Button
                variant="primary"
                disabled={
                  pending ||
                  ["CONCLUIDO", "CANCELADO"].includes(
                    String(detail.inventory.status),
                  )
                }
                onClick={approve}
              >
                Aprovar ajustes e concluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

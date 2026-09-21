"use client";
import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { LookupKind } from "../produto/lookup/lookup-types";
import { ProductReferenceRegistrationModal } from "./product-reference-registration-modal";
import { CreateProductButton } from "../produto/create-product-button";
import { StockMovementButton } from "../movimentacao/stock-movement-button";
import { StockAlerts } from "./stock-alerts";
import { StockMovements } from "./stock-movements";
import type { ProductFormProps } from "../produto/product-types";
import type { StockOverviewData } from "./stock-overview-types";
import { StockTransferModal } from "../transferencia/stock-transfer-modal";
import { InventoryModal } from "../inventario/inventory-modal";
import {
  StockStructureRegistrationModal,
  type StructureKind,
} from "./stock-structure-registration-modal";
import { StockAdjustmentModal } from "../ajuste/stock-adjustment-modal";

const registrations: Array<{ kind: LookupKind; label: string }> = [
  { kind: "category", label: "Categoria" },
  { kind: "brand", label: "Marca" },
  { kind: "unit", label: "Unidade" },
  { kind: "type", label: "Tipo de produto" },
];
const technical: Array<{ kind: LookupKind; label: string }> = [
  { kind: "manufacturer", label: "Fabricante" },
  { kind: "model", label: "Modelo / linha" },
  { kind: "material", label: "Material" },
  { kind: "finish", label: "Acabamento / cor" },
];
const itemClass =
  "w-full rounded-xl px-3 py-2 text-left text-sm font-semibold hover:bg-white/70";
type Panel = "alerts" | "movements" | "locations" | "reasons";

export function ProductReferenceMenus({
  s,
  productOptions,
}: {
  s: StockOverviewData;
  productOptions: Pick<
    ProductFormProps,
    "categories" | "brands" | "warehouses" | "suppliers"
  >;
}) {
  const [open, setOpen] = useState<string | null>(null),
    [selected, setSelected] = useState<{
      kind: LookupKind;
      label: string;
    } | null>(null),
    [panel, setPanel] = useState<Panel | null>(null),
    [transfer, setTransfer] = useState(false),
    [inventory, setInventory] = useState(false),
    [adjustment, setAdjustment] = useState(false),
    [structure, setStructure] = useState<StructureKind | null>(null);
  const choose = (value: { kind: LookupKind; label: string }) => {
    setSelected(value);
    setOpen(null);
  };
  const show = (value: Panel) => {
    setPanel(value);
    setOpen(null);
  };
  const dropdown = (label: string, children: ReactNode) => (
    <div className="relative" key={label}>
      <Button onClick={() => setOpen(open === label ? null : label)}>
        {label}
        <ChevronDown size={14} />
      </Button>
      {open === label && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[100] grid min-w-64 gap-1 rounded-2xl border border-white/80 bg-[#e5e5e8] p-2 shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
  const pendingTitle =
    panel &&
    (
      { locations: "Localização", reasons: "Motivos de ajuste" } as Partial<
        Record<Panel, string>
      >
    )[panel];
  return (
    <>
      <div className="relative z-50 flex flex-wrap gap-2">
        {dropdown(
          "Cadastros",
          <>
            <CreateProductButton {...productOptions} menuItem />
            {registrations.map((value) => (
              <button
                key={value.kind}
                className={itemClass}
                onClick={() => choose(value)}
              >
                + Cadastrar {value.label}
              </button>
            ))}
          </>,
        )}
        {dropdown(
          "Logística",
          <>
            <StockMovementButton
              menuItem
              products={s.rows.map((p) => ({ id: p.id, name: p.name }))}
              warehouses={productOptions.warehouses}
              suppliers={productOptions.suppliers}
            />
            <button
              className={itemClass}
              onClick={() => {
                setTransfer(true);
                setOpen(null);
              }}
            >
              Transferências
            </button>
            <button className={itemClass} onClick={() => show("alerts")}>
              Reposição necessária
            </button>
            <button className={itemClass} onClick={() => show("movements")}>
              Últimas movimentações
            </button>
            <button
              className={itemClass}
              onClick={() => {
                setInventory(true);
                setOpen(null);
              }}
            >
              Inventário
            </button>
            <button
              className={itemClass}
              onClick={() => {
                setAdjustment(true);
                setOpen(null);
              }}
            >
              Ajustes de estoque
            </button>
            <button
              className={itemClass}
              onClick={() => {
                setStructure("site");
                setOpen(null);
              }}
            >
              Unidade / estabelecimento
            </button>
            <button
              className={itemClass}
              onClick={() => {
                setStructure("warehouse");
                setOpen(null);
              }}
            >
              Depósito
            </button>
            <button
              className={itemClass}
              onClick={() => {
                setStructure("location");
                setOpen(null);
              }}
            >
              Localização
            </button>
            <button
              className={itemClass}
              onClick={() => choose({ kind: "supplier", label: "Fornecedor" })}
            >
              Fornecedor
            </button>
            <button className={itemClass} onClick={() => show("reasons")}>
              Motivos de ajuste
            </button>
          </>,
        )}
        {dropdown(
          "Ficha técnica",
          <>
            {technical.map((value) => (
              <button
                key={value.kind}
                className={itemClass}
                onClick={() => choose(value)}
              >
                + Cadastrar {value.label}
              </button>
            ))}
          </>,
        )}
      </div>
      {selected && (
        <ProductReferenceRegistrationModal
          {...selected}
          onClose={() => setSelected(null)}
        />
      )}
      {transfer && (
        <StockTransferModal
          products={s.rows.map((p) => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            unitId: String(p.values.unitId || ""),
            unitName: p.unit,
            warehouseId: String(p.values.warehouseId || ""),
            available: p.available,
          }))}
          warehouses={productOptions.warehouses}
          onClose={() => setTransfer(false)}
        />
      )}
      {inventory && (
        <InventoryModal
          products={s.rows.map((p) => ({ id: p.id, name: p.name }))}
          warehouses={productOptions.warehouses}
          onClose={() => setInventory(false)}
        />
      )}
      {adjustment && (
        <StockAdjustmentModal
          products={s.rows.map((p) => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            unit: p.unit,
            stock: p.stock,
            reserved: p.reserved,
            warehouseId: String(p.values.warehouseId || ""),
          }))}
          history={s.movements.filter((movement) => movement.type === "AJUSTE")}
          onClose={() => setAdjustment(false)}
        />
      )}
      {structure && (
        <StockStructureRegistrationModal
          kind={structure}
          onClose={() => setStructure(null)}
        />
      )}
      {panel === "alerts" && (
        <Modal
          open
          title="Reposição necessária"
          width="max-w-5xl"
          onClose={() => setPanel(null)}
        >
          <StockAlerts alerts={s.rows.filter((row) => row.status !== "OK")} />
        </Modal>
      )}
      {panel === "movements" && (
        <Modal
          open
          title="Últimas movimentações"
          width="max-w-5xl"
          onClose={() => setPanel(null)}
        >
          <StockMovements s={s} />
        </Modal>
      )}
      {pendingTitle && (
        <Modal open title={pendingTitle} onClose={() => setPanel(null)}>
          <p className="text-sm text-ink-500">
            Este módulo ainda não possui operação disponível.
          </p>
        </Modal>
      )}
    </>
  );
}

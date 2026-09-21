"use client";

import type { LookupKind } from "../../produto/lookup/lookup-types";
import type { ProductFormProps } from "../../produto/product-types";
import type { StructureKind } from "../stock-structure-registration-modal";
import type { StockOverviewData } from "../stock-overview-types";
import type { Panel } from "../product-reference-menus";

import { ProductReferenceRegistrationModal } from "../product-reference-registration-modal";
import { StockTransferModal } from "../../transferencia/stock-transfer-modal";
import { InventoryModal } from "../../inventario/inventory-modal";
import { StockAdjustmentModal } from "../../ajuste/stock-adjustment-modal";
import { StockStructureRegistrationModal } from "../stock-structure-registration-modal";

import { AlertsModal } from "./alerts-modal";
import { MovementsModal } from "./movements-modal";
import { PendingOperationModal } from "./pending-operation-modal";

import {
  mapProductsForAdjustment,
  mapProductsForTransfer,
} from "../utils/stock-mappers";

type Props = {
  s: StockOverviewData;
  productOptions: Pick<
    ProductFormProps,
    "categories" | "brands" | "warehouses" | "suppliers"
  >;

  selectedReference: {
    kind: LookupKind;
    label: string;
  } | null;
  onCloseReference: () => void;

  panel: Panel | null;
  onClosePanel: () => void;

  transferOpen: boolean;
  onCloseTransfer: () => void;

  inventoryOpen: boolean;
  onCloseInventory: () => void;

  adjustmentOpen: boolean;
  onCloseAdjustment: () => void;

  structure: StructureKind | null;
  onCloseStructure: () => void;
};

export function ProductReferenceModals({
  s,
  productOptions,
  selectedReference,
  onCloseReference,
  panel,
  onClosePanel,
  transferOpen,
  onCloseTransfer,
  inventoryOpen,
  onCloseInventory,
  adjustmentOpen,
  onCloseAdjustment,
  structure,
  onCloseStructure,
}: Props) {
  return (
    <>
      {selectedReference && (
        <ProductReferenceRegistrationModal
          {...selectedReference}
          onClose={onCloseReference}
        />
      )}

      {transferOpen && (
        <StockTransferModal
          products={mapProductsForTransfer(s)}
          warehouses={productOptions.warehouses}
          onClose={onCloseTransfer}
        />
      )}

      {inventoryOpen && (
        <InventoryModal
          products={s.rows.map((p) => ({
            id: p.id,
            name: p.name,
          }))}
          warehouses={productOptions.warehouses}
          onClose={onCloseInventory}
        />
      )}

      {adjustmentOpen && (
        <StockAdjustmentModal
          products={mapProductsForAdjustment(s)}
          history={s.movements.filter(
            (movement) => movement.type === "AJUSTE",
          )}
          onClose={onCloseAdjustment}
        />
      )}

      {structure && (
        <StockStructureRegistrationModal
          kind={structure}
          onClose={onCloseStructure}
        />
      )}

      {panel === "alerts" && (
        <AlertsModal s={s} onClose={onClosePanel} />
      )}

      {panel === "movements" && (
        <MovementsModal s={s} onClose={onClosePanel} />
      )}

      {(panel === "locations" || panel === "reasons") && (
        <PendingOperationModal panel={panel} onClose={onClosePanel} />
      )}
    </>
  );
}

"use client";

import type { Dispatch, SetStateAction } from "react";
import type { LookupKind } from "../../produto/lookup/lookup-types";
import type { ProductFormProps } from "../../produto/product-types";
import type { StructureKind } from "../stock-structure-registration-modal";
import type { StockOverviewData } from "../stock-overview-types";
import type { Panel } from "../product-reference-menus";

import { StockMovementButton } from "../../movimentacao/stock-movement-button";
import { DropdownMenu } from "./dropdown-menu";
import { ITEM_CLASS } from "../constants/reference-menu-options";

type Props = {
  openMenu: string | null;
  setOpenMenu: Dispatch<SetStateAction<string | null>>;
  s: StockOverviewData;
  productOptions: Pick<
    ProductFormProps,
    "categories" | "brands" | "warehouses" | "suppliers"
  >;
  onTransfer: () => void;
  onInventory: () => void;
  onAdjustment: () => void;
  onPanel: (panel: Panel) => void;
  onStructure: (kind: StructureKind) => void;
  onSelectReference: (value: {
    kind: LookupKind;
    label: string;
  }) => void;
};

export function LogisticsMenu({
  openMenu,
  setOpenMenu,
  s,
  productOptions,
  onTransfer,
  onInventory,
  onAdjustment,
  onPanel,
  onStructure,
  onSelectReference,
}: Props) {
  const label = "Logística";

  return (
    <DropdownMenu
      label={label}
      open={openMenu === label}
      onToggle={() => setOpenMenu(openMenu === label ? null : label)}
    >
      <StockMovementButton
        menuItem
        products={s.rows.map((p) => ({
          id: p.id,
          name: p.name,
        }))}
        warehouses={productOptions.warehouses}
        suppliers={productOptions.suppliers}
      />

      <button className={ITEM_CLASS} onClick={onTransfer}>
        Transferências
      </button>

      <button className={ITEM_CLASS} onClick={() => onPanel("alerts")}>
        Reposição necessária
      </button>

      <button className={ITEM_CLASS} onClick={() => onPanel("movements")}>
        Últimas movimentações
      </button>

      <button className={ITEM_CLASS} onClick={onInventory}>
        Inventário
      </button>

      <button className={ITEM_CLASS} onClick={onAdjustment}>
        Ajustes de estoque
      </button>

      <button className={ITEM_CLASS} onClick={() => onStructure("site")}>
        Unidade / estabelecimento
      </button>

      <button className={ITEM_CLASS} onClick={() => onStructure("warehouse")}>
        Depósito
      </button>

      <button className={ITEM_CLASS} onClick={() => onStructure("location")}>
        Localização
      </button>

      <button
        className={ITEM_CLASS}
        onClick={() =>
          onSelectReference({
            kind: "supplier",
            label: "Fornecedor",
          })
        }
      >
        Fornecedor
      </button>

      <button className={ITEM_CLASS} onClick={() => onPanel("reasons")}>
        Motivos de ajuste
      </button>
    </DropdownMenu>
  );
}

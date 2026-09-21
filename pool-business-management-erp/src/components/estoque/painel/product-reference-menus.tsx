"use client";

import { useState } from "react";
import type { LookupKind } from "../produto/lookup/lookup-types";
import type { ProductFormProps } from "../produto/product-types";
import type { StockOverviewData } from "./stock-overview-types";
import type { StructureKind } from "./stock-structure-registration-modal";

import { RegistrationMenu } from "./menus/registration-menu";
import { LogisticsMenu } from "./menus/logistics-menu";
import { TechnicalMenu } from "./menus/technical-menu";
import { ProductReferenceModals } from "./modals/product-reference-modals";

export type Panel = "alerts" | "movements" | "locations" | "reasons";

type ProductReferenceMenusProps = {
  s: StockOverviewData;
  productOptions: Pick<
    ProductFormProps,
    "categories" | "brands" | "warehouses" | "suppliers"
  >;
};

export function ProductReferenceMenus({
  s,
  productOptions,
}: ProductReferenceMenusProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [selectedReference, setSelectedReference] = useState<{
    kind: LookupKind;
    label: string;
  } | null>(null);

  const [panel, setPanel] = useState<Panel | null>(null);

  const [transferOpen, setTransferOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [adjustmentOpen, setAdjustmentOpen] = useState(false);

  const [structure, setStructure] = useState<StructureKind | null>(null);

  const closeMenu = () => setOpenMenu(null);

  return (
    <>
      <div className="relative z-50 flex flex-wrap gap-2">
        <RegistrationMenu
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          productOptions={productOptions}
          onSelect={(value) => {
            setSelectedReference(value);
            closeMenu();
          }}
        />

        <LogisticsMenu
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          s={s}
          productOptions={productOptions}
          onTransfer={() => {
            setTransferOpen(true);
            closeMenu();
          }}
          onInventory={() => {
            setInventoryOpen(true);
            closeMenu();
          }}
          onAdjustment={() => {
            setAdjustmentOpen(true);
            closeMenu();
          }}
          onPanel={(value) => {
            setPanel(value);
            closeMenu();
          }}
          onStructure={(value) => {
            setStructure(value);
            closeMenu();
          }}
          onSelectReference={(value) => {
            setSelectedReference(value);
            closeMenu();
          }}
        />

        <TechnicalMenu
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          onSelect={(value) => {
            setSelectedReference(value);
            closeMenu();
          }}
        />
      </div>

      <ProductReferenceModals
        s={s}
        productOptions={productOptions}
        selectedReference={selectedReference}
        onCloseReference={() => setSelectedReference(null)}
        panel={panel}
        onClosePanel={() => setPanel(null)}
        transferOpen={transferOpen}
        onCloseTransfer={() => setTransferOpen(false)}
        inventoryOpen={inventoryOpen}
        onCloseInventory={() => setInventoryOpen(false)}
        adjustmentOpen={adjustmentOpen}
        onCloseAdjustment={() => setAdjustmentOpen(false)}
        structure={structure}
        onCloseStructure={() => setStructure(null)}
      />
    </>
  );
}

"use client";

import { useMemo, useState, useTransition } from "react";

import { EntryHeaderSection } from "./sections/entry-header-section";
import { SupplierOperationSection } from "./sections/supplier-operation-section";
import { StockEntryActions } from "./stock-entry-actions";
import { StockEntryItemForm } from "./stock-entry-item-form";
import { StockEntryItemTable } from "./stock-entry-item-table";
import { StockEntryTabs } from "./stock-entry-tabs";
import { StockEntryTotals } from "./stock-entry-totals";
import { AttachmentsTab } from "./tabs/attachments-tab";
import { ImagesTab } from "./tabs/images-tab";
import { NotesTab } from "./tabs/notes-tab";
import { OtherDataTab } from "./tabs/other-data-tab";

import type {
  Option,
  StockEntryFormData,
  StockEntryItem,
  StockEntryTab,
} from "./stock-entry-types";

type Props = {
  products: Option[];
  suppliers: Option[];
  warehouses: Option[];
  costCenters: Option[];
  onCancel: () => void;
  onSuccess?: () => void;
  onSubmit?: (data: StockEntryFormData) => Promise<void> | void;
};

const read = (fd: FormData, key: string) =>
  String(fd.get(key) ?? "").trim();

export function StockEntryForm({
  products,
  suppliers,
  warehouses,
  costCenters,
  onCancel,
  onSuccess,
  onSubmit,
}: Props) {
  const [activeTab, setActiveTab] =
    useState<StockEntryTab>("PRINCIPAL");

  const [items, setItems] = useState<StockEntryItem[]>([]);
  const [freight, setFreight] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [otherExpenses, setOtherExpenses] = useState(0);

  const [pending, startTransition] = useTransition();

  const canSave = items.length > 0;

  function addItem(item: StockEntryItem) {
    setItems((current) => [...current, item]);
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);

    const data: StockEntryFormData = {
      code: read(fd, "code"),
      operationType: read(fd, "operationType"),
      invoiceNumber: read(fd, "invoiceNumber"),
      issueDate: read(fd, "issueDate"),
      entryDate: read(fd, "entryDate"),
      entryTime: read(fd, "entryTime"),
      invoiceOk: fd.get("invoiceOk") === "on",

      supplierId: read(fd, "supplierId"),
      supplierDocument: read(fd, "supplierDocument"),
      stateRegistration: read(fd, "stateRegistration"),

      operationNature: read(fd, "operationNature"),
      costCenterId: read(fd, "costCenterId"),
      warehouseId: read(fd, "warehouseId"),

      paymentCondition: read(fd, "paymentCondition"),
      paymentMethod: read(fd, "paymentMethod"),
      carrier: read(fd, "carrier"),

      freight,
      discount,
      otherExpenses,

      internalNotes: read(fd, "internalNotes"),
      fiscalNotes: read(fd, "fiscalNotes"),
      supplierNotes: read(fd, "supplierNotes"),

      items,
    };

    startTransition(async () => {
      await onSubmit?.(data);
      onSuccess?.();
    });
  }

  return (
    <form onSubmit={submit} className="flex h-full min-h-0 flex-col">
      <div className="pb-4">
        <StockEntryTabs active={activeTab} onChange={setActiveTab} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {activeTab === "PRINCIPAL" && (
          <div className="space-y-4">
            <EntryHeaderSection />

            <SupplierOperationSection
              suppliers={suppliers}
              warehouses={warehouses}
              costCenters={costCenters}
            />

            <StockEntryItemForm
              products={products}
              onAdd={addItem}
            />

            <StockEntryItemTable
              items={items}
              onRemove={removeItem}
            />

            <StockEntryTotals
              items={items}
              freight={freight}
              discount={discount}
              otherExpenses={otherExpenses}
              onFreightChange={setFreight}
              onDiscountChange={setDiscount}
              onOtherExpensesChange={setOtherExpenses}
            />
          </div>
        )}

        {activeTab === "OUTROS_DADOS" && <OtherDataTab />}
        {activeTab === "OBSERVACOES" && <NotesTab />}
        {activeTab === "IMAGENS" && <ImagesTab />}
        {activeTab === "ANEXOS" && <AttachmentsTab />}
      </div>

      <div className="pt-4">
        <StockEntryActions
          pending={pending}
          canSave={canSave}
          onCancel={onCancel}
        />
      </div>
    </form>
  );
}

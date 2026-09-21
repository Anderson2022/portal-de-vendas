import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { StockEntryItemState } from "./use-stock-entry-item";

export function StockEntryItemTrackingFields({ item }: { item: Pick<StockEntryItemState, "batchNumber" | "setBatchNumber" | "expirationDate" | "setExpirationDate" | "serialNumber" | "setSerialNumber" | "notes" | "setNotes"> }) {
  const { batchNumber, setBatchNumber, expirationDate, setExpirationDate, serialNumber, setSerialNumber, notes, setNotes } = item;
  return (<>
    <div className="col-span-3">
      <Field label="Lote">
        <Input
          value={batchNumber}
          onChange={(e) => setBatchNumber(e.target.value)}
          className="input"
        />
      </Field>
    </div>
    <div className="col-span-2">
      <Field label="Validade">
        <Input
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          type="date"
          className="input"
        />
      </Field>
    </div>
    <div className="col-span-3">
      <Field label="Número de série">
        <Input
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          className="input"
        />
      </Field>
    </div>
    <div className="col-span-4">
      <Field label="Observação do item">
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input"
        />
      </Field>
    </div>
  </>);
}

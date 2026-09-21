import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function TraceabilitySection() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Field label="Lote">
        <Input
          name="batchNumber"
          className="input"
          placeholder="Ex.: LT-2026-0910"
        />
      </Field>

      <Field label="Validade">
        <Input
          name="expirationDate"
          type="date"
          className="input"
        />
      </Field>

      <Field label="Número de série">
        <Input
          name="serialNumber"
          className="input"
          placeholder="Ex.: SN00012345"
        />
      </Field>
    </div>
  );
}

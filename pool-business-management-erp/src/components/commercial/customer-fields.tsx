import { Select } from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import { NewClientButton } from "@/components/dialogs";
import type { FormOptions } from "@/lib/commercial/domain";
export function CustomerFields({
  options,
  customerId,
  salespersonId,
}: {
  options: FormOptions;
  customerId?: string;
  salespersonId?: string | null;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Cliente *">
        <Select
          className="input"
          name="customerId"
          required
          defaultValue={customerId || ""}
        >
          <option value="">Selecione o cliente</option>
          {options.customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Vendedor responsável">
        <Select
          className="input"
          name="salespersonId"
          defaultValue={salespersonId || ""}
        >
          <option value="">Sem vendedor</option>
          {options.sellers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </Field>
      <div className="sm:col-span-2">
        <NewClientButton label="Cadastrar novo cliente" variant="text" />
      </div>
    </div>
  );
}

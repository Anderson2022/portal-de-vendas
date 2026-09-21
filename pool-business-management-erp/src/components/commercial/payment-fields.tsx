import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import { paymentMethods, todayISO } from "@/lib/commercial/domain";
export function PaymentFields() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Field label="Forma de pagamento">
        <Select name="paymentMethod" className="input">
          {Object.entries(paymentMethods).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Recebimento">
        <Select name="paid" className="input">
          <option value="false">A receber</option>
          <option value="true">Já recebido</option>
        </Select>
      </Field>
      <Field label="Vencimento *">
        <Input
          name="dueDate"
          type="date"
          className="input"
          required
          defaultValue={todayISO()}
        />
      </Field>
    </div>
  );
}

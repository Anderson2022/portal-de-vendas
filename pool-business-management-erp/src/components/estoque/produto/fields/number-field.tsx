import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props = {
  label: string;
  name: string;
  required?: boolean;
  step?: string | number;
  readOnly?: boolean;
};

export function NumberField({
  label,
  name,
  required = false,
  step = "0.001",
  readOnly = false,
}: Props) {
  return (
    <Field label={label}>
      <Input
        required={required}
        name={name}
        type="number"
        min="0"
        step={step}
        readOnly={readOnly}
        className="input"
        placeholder="0"
      />
    </Field>
  );
}

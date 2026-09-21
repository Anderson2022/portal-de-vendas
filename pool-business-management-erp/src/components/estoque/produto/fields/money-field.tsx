import type { ComponentProps } from "react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props = Omit<ComponentProps<typeof Input>, "type"> & { label: string; name: string };

export function MoneyField({ label, name, required = false, ...props }: Props) {
  return (
    <Field label={label + " (R$)"}>
      <Input name={name} required={required} type="number" step="0.01" min="0" placeholder="0,00" {...props} />
    </Field>
  );
}

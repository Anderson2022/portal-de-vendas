import type { ComponentProps } from "react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function DetailField({ label, ...props }: ComponentProps<typeof Input> & { label: string }) {
  return <Field label={label}><Input {...props} /></Field>;
}

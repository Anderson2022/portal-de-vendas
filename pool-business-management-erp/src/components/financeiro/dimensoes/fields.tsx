import type { ReactNode } from "react";
import type { DimensionOption } from "@/lib/financeiro/dimensoes/types";

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 p-4">
      <h3 className="font-bold">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}
export function Field({
  label,
  name,
  value,
  type = "text",
  required = false,
  maxLength,
}: {
  label: string;
  name: string;
  value?: string | number | null;
  type?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <label className="text-sm font-semibold">
      {label}
      {required ? " *" : ""}
      <input
        className="input mt-1 w-full"
        name={name}
        defaultValue={value ?? ""}
        type={type}
        required={required}
        maxLength={maxLength}
        min={type === "number" ? 0 : undefined}
        step={type === "number" ? "0.01" : undefined}
      />
    </label>
  );
}
export function TextField({
  label,
  name,
  value,
}: {
  label: string;
  name: string;
  value?: string | null;
}) {
  return (
    <label className="text-sm font-semibold md:col-span-2">
      {label}
      <textarea
        className="input mt-1 w-full"
        name={name}
        defaultValue={value ?? ""}
        rows={3}
        maxLength={10000}
      />
    </label>
  );
}
export function Check({
  label,
  name,
  value = true,
}: {
  label: string;
  name: string;
  value?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold">
      <input type="checkbox" name={name} defaultChecked={value} />
      {label}
    </label>
  );
}
export function SelectField({
  label,
  name,
  value,
  options,
  required = false,
}: {
  label: string;
  name: string;
  value?: string | number | null;
  options: DimensionOption[];
  required?: boolean;
}) {
  return (
    <label className="text-sm font-semibold">
      {label}
      {required ? " *" : ""}
      <select
        className="input mt-1 w-full"
        name={name}
        defaultValue={value == null ? "" : String(value)}
        required={required}
      >
        <option value="">Selecione</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.code ? `${option.code} — ` : ""}
            {option.name}
            {option.active === false ? " (inativo)" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
export function choices(values: string) {
  return values.split("|").map((value) => {
    const [id, name] = value.split(":");
    return { id, name };
  });
}

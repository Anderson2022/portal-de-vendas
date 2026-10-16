import type { ChangeEventHandler } from "react";
export function Switch({
  label,
  name,
  checked = false,
}: {
  label: string;
  name: string;
  checked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-bold">
      <input type="checkbox" name={name} defaultChecked={checked} />
      {label}
    </label>
  );
}
export function Field({
  label,
  name,
  type = "text",
  readOnly = false,
  defaultValue,
  maxLength,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  readOnly?: boolean;
  defaultValue?: string;
  maxLength?: number;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <label className="text-sm font-bold">
      {label}
      <input
        className="input mt-1 w-full"
        name={name}
        type={type}
        readOnly={readOnly}
        defaultValue={defaultValue}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        required={label.includes("*")}
      />
    </label>
  );
}
export function Area({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <label className="text-sm font-bold">
      {label}
      <textarea
        className="input mt-1 min-h-28 w-full"
        name={name}
        defaultValue={defaultValue}
        maxLength={10000}
      />
    </label>
  );
}

"use client";

type ActiveFieldProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
};

export function ActiveField({
  checked,
  onChange,
  label = "Registro ativo",
}: ActiveFieldProps) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}

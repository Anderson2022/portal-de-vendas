import { cloneElement, isValidElement, useId, type ReactNode } from "react";
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  const generatedId = useId();
  const control = isValidElement<{ id?: string; "aria-describedby"?: string }>(children) ? children : null;
  const id = control?.props.id || generatedId;
  return (
    <div className="block min-w-0">
      <label htmlFor={id} className="mb-2 block text-xs font-bold text-ink-700">{label}</label>
      {control ? cloneElement(control, { id, "aria-describedby": hint ? `${id}-hint` : control.props["aria-describedby"] }) : children}
      {hint && <span id={`${id}-hint`} className="mt-1 block text-xs text-ink-500">{hint}</span>}
    </div>
  );
}

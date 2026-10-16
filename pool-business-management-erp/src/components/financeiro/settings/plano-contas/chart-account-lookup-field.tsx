"use client";
import { useId, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChartLookups } from "./chart-lookup-context";
import { ChartLookupModal } from "./chart-lookup-modal";
export function ChartAccountLookupField({
  label,
  name,
  required = false,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const { lookups, selected, select, add, accountId } = useChartLookups();
  const group = lookups[name];
  const value = selected[name] ?? "";
  const parent = group.parentKey ? selected[group.parentKey] : undefined;
  const current = group.options.find((option) => option.id === value);
  const excluded = new Set<string>(
    name === "parentAccount" && accountId ? [accountId] : [],
  );
  if (name === "parentAccount") {
    let changed = true;
    while (changed) {
      changed = false;
      for (const option of group.options)
        if (
          option.parentId &&
          excluded.has(option.parentId) &&
          !excluded.has(option.id)
        ) {
          excluded.add(option.id);
          changed = true;
        }
    }
  }
  if (name === "closingAccount" && accountId) excluded.add(accountId);
  const options = group.options.filter(
    (option) =>
      !excluded.has(option.id) &&
      (!group.parentKey || option.parentId === parent),
  );
  return (
    <div>
      <label htmlFor={inputId} className="mb-1 block text-sm font-semibold">
        {label}
        {required ? " *" : ""}
      </label>
      <input type="hidden" name={name} value={value} />
      <div className="relative">
        <input
          id={inputId}
          className="input w-full !pr-16"
          value={current?.name ?? ""}
          readOnly
          placeholder="Pesquisar"
        />
        {value && !required && name !== "company" && (
          <Button
            variant="unstyled"
            className="absolute right-9 top-1/2 -translate-y-1/2"
            aria-label={`Limpar ${label}`}
            onClick={() => select(name, "")}
          >
            <X size={14} />
          </Button>
        )}
        <Button
          variant="unstyled"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          aria-label={`Pesquisar ${label}`}
          onClick={() => setOpen(true)}
        >
          <Search size={17} />
        </Button>
      </div>
      {group.parentKey && !parent && (
        <p className="mt-1 text-xs text-ink-500">
          Selecione primeiro o cadastro superior.
        </p>
      )}
      {open && (
        <ChartLookupModal
          label={label}
          lookupKey={name}
          options={options}
          canCreate={group.canCreate && (!group.parentKey || !!parent)}
          parentId={parent}
          onSelect={(id) => {
            select(name, id);
            setOpen(false);
          }}
          onCreated={(option) => {
            add(name, option);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

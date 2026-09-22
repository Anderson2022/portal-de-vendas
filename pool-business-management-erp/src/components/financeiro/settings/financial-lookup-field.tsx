"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export function FinancialLookupField({
  label,
  name,
  required = false,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const key = `poolcontrol:financial:${name}`;

  useEffect(() => {
    setOptions(JSON.parse(localStorage.getItem(key) || "[]"));
  }, [key]);

  function create() {
    const name = query.trim();
    if (!name) return;
    const next = Array.from(new Set([...options, name]));
    localStorage.setItem(key, JSON.stringify(next));
    setOptions(next);
    setValue(name);
    setOpen(false);
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-semibold">
        {label}
        {required ? " *" : ""}
      </label>
      <div className="relative">
        <input
          className="input w-full !pr-10"
          name={name}
          value={value}
          readOnly
          required={required}
          placeholder="Pesquisar"
        />
        <Button
          type="button"
          variant="unstyled"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          aria-label={`Pesquisar ${label}`}
          onClick={() => setOpen(true)}
        >
          <Search size={17} />
        </Button>
      </div>
      {open && (
        <Modal
          open
          title={`Pesquisar ${label}`}
          width="max-w-xl"
          onClose={() => setOpen(false)}
        >
          <div className="space-y-4 pt-4">
            <input
              className="input w-full"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Digite para pesquisar ou cadastrar"
              autoFocus
            />
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {options
                .filter((item) =>
                  item.toLowerCase().includes(query.toLowerCase()),
                )
                .map((item) => (
                  <button
                    type="button"
                    key={item}
                    className="w-full rounded-xl border border-black/5 p-3 text-left hover:bg-water-50"
                    onClick={() => {
                      setValue(item);
                      setOpen(false);
                    }}
                  >
                    {item}
                  </button>
                ))}
            </div>
            <div className="flex justify-end">
              <Button type="button" variant="primary" onClick={create}>
                + Cadastrar e selecionar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

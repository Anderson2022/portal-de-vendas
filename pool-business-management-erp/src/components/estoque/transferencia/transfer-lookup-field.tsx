"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

export type TransferLookupOption = {
  id: string;
  name: string;
  code?: string;
  unit?: string;
  warehouse?: string;
  available?: number;
};

export function TransferLookupField({
  label,
  value,
  options,
  onSelect,
  onCreate,
  createKind,
  disabled,
}: {
  label: string;
  value: string;
  options: TransferLookupOption[];
  onSelect: (id: string) => void;
  onCreate?: (
    code: string,
    name: string,
    details: Record<string, string>,
  ) => Promise<void>;
  createKind?: "site" | "warehouse" | "location";
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((item) => item.id === value);
  return (
    <>
      <label className="space-y-1 text-sm font-semibold">
        <span>{label}</span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          className="input relative flex w-full items-center text-left font-normal disabled:opacity-50"
        >
          <span className="min-w-0 flex-1 truncate">
            {selected
              ? `${selected.code ? `${selected.code} - ` : ""}${selected.name}`
              : "Pesquisar..."}
          </span>
          <Search size={16} />
        </button>
      </label>
      {open && (
        <TransferLookupModal
          title={label}
          options={options}
          onClose={() => setOpen(false)}
          onSelect={(id) => {
            onSelect(id);
            setOpen(false);
          }}
          onCreate={onCreate}
          createKind={createKind}
        />
      )}
    </>
  );
}

function TransferLookupModal({
  title,
  options,
  onClose,
  onSelect,
  onCreate,
  createKind,
}: {
  title: string;
  options: TransferLookupOption[];
  onClose: () => void;
  onSelect: (id: string) => void;
  onCreate?: (
    code: string,
    name: string,
    details: Record<string, string>,
  ) => Promise<void>;
  createKind?: "site" | "warehouse" | "location";
}) {
  const [query, setQuery] = useState(""),
    [creating, setCreating] = useState(false);
  const [code, setCode] = useState(""),
    [name, setName] = useState(""),
    [details, setDetails] = useState<Record<string, string>>({}),
    [error, setError] = useState("");
  const rows = useMemo(
    () =>
      options.filter((item) =>
        `${item.id} ${item.code ?? ""} ${item.name}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [options, query],
  );
  const productDetails = options.some(
    (item) =>
      item.unit !== undefined ||
      item.warehouse !== undefined ||
      item.available !== undefined,
  );
  const save = async () => {
    try {
      setError("");
      await onCreate?.(code, name, details);
      setCreating(false);
      setCode("");
      setName("");
      setDetails({});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível cadastrar.");
    }
  };
  return (
    <Modal
      open
      title={`Pesquisar ${title}`}
      width="max-w-3xl"
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Input
              autoFocus
              className="w-full !pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar por código ou descrição..."
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2"
              size={16}
            />
          </div>
          {onCreate && (
            <Button variant="primary" onClick={() => setCreating(true)}>
              <Plus size={16} />
              Cadastrar
            </Button>
          )}
        </div>
        {creating && (
          <div className="grid gap-3 rounded-2xl border p-4 sm:grid-cols-2">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Código (automático se vazio)"
            />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Descrição"
            />
            {createKind === "site" && (
              <>
                <Input
                  placeholder="Cidade"
                  value={details.city || ""}
                  onChange={(e) =>
                    setDetails({ ...details, city: e.target.value })
                  }
                />
                <Input
                  placeholder="UF"
                  maxLength={2}
                  value={details.uf || ""}
                  onChange={(e) =>
                    setDetails({ ...details, uf: e.target.value })
                  }
                />
              </>
            )}
            {createKind === "warehouse" && (
              <>
                <Input
                  placeholder="Tipo do depósito"
                  value={details.type || ""}
                  onChange={(e) =>
                    setDetails({ ...details, type: e.target.value })
                  }
                />
                <Input
                  placeholder="Descrição"
                  value={details.description || ""}
                  onChange={(e) =>
                    setDetails({ ...details, description: e.target.value })
                  }
                />
              </>
            )}
            {createKind === "location" && (
              <>
                <select
                  className="input"
                  value={details.type || "POSICAO"}
                  onChange={(e) =>
                    setDetails({ ...details, type: e.target.value })
                  }
                >
                  {[
                    "AREA",
                    "CORREDOR",
                    "PRATELEIRA",
                    "COLUNA",
                    "LINHA",
                    "POSICAO",
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
                <select
                  className="input"
                  value={details.parentId || ""}
                  onChange={(e) =>
                    setDetails({ ...details, parentId: e.target.value })
                  }
                >
                  <option value="">Sem localização pai</option>
                  {options.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Prateleira"
                  value={details.shelf || ""}
                  onChange={(e) =>
                    setDetails({ ...details, shelf: e.target.value })
                  }
                />
                <Input
                  placeholder="Coluna"
                  value={details.column || ""}
                  onChange={(e) =>
                    setDetails({ ...details, column: e.target.value })
                  }
                />
                <Input
                  placeholder="Linha"
                  value={details.row || ""}
                  onChange={(e) =>
                    setDetails({ ...details, row: e.target.value })
                  }
                />
                <Input
                  placeholder="Posição"
                  value={details.position || ""}
                  onChange={(e) =>
                    setDetails({ ...details, position: e.target.value })
                  }
                />
                <Input
                  placeholder="Capacidade"
                  type="number"
                  value={details.capacity || ""}
                  onChange={(e) =>
                    setDetails({ ...details, capacity: e.target.value })
                  }
                />
                <Input
                  placeholder="Observação"
                  value={details.notes || ""}
                  onChange={(e) =>
                    setDetails({ ...details, notes: e.target.value })
                  }
                />
              </>
            )}
            <div className="sm:col-span-2 flex justify-end">
              <Button variant="primary" disabled={!name.trim()} onClick={save}>
                Salvar
              </Button>
            </div>
          </div>
        )}
        {error && <p className="text-coral-500">{error}</p>}
        <div className="overflow-x-auto rounded-2xl border">
          <div
            className={`grid ${productDetails ? "min-w-[780px] grid-cols-[70px_130px_1fr_100px_180px_100px]" : "grid-cols-[90px_160px_1fr]"} bg-white/50 px-4 py-3 text-xs font-bold uppercase`}
          >
            <span>ID</span>
            <span>Código</span>
            <span>Descrição</span>
            {productDetails && (
              <>
                <span>Unidade</span>
                <span>Depósito</span>
                <span>Disponível</span>
              </>
            )}
          </div>
          {rows.map((item) => (
            <button
              type="button"
              key={item.id}
              onDoubleClick={() => onSelect(item.id)}
              onClick={() => onSelect(item.id)}
              className={`grid w-full ${productDetails ? "min-w-[780px] grid-cols-[70px_130px_1fr_100px_180px_100px]" : "grid-cols-[90px_160px_1fr]"} border-t px-4 py-3 text-left text-sm hover:bg-white/60`}
            >
              <span>{item.id}</span>
              <span>{item.code ?? "—"}</span>
              <span>{item.name}</span>
              {productDetails && (
                <>
                  <span>{item.unit || "—"}</span>
                  <span>{item.warehouse || "—"}</span>
                  <span>{item.available ?? 0}</span>
                </>
              )}
            </button>
          ))}
          {!rows.length && (
            <p className="p-5 text-sm text-ink-400">
              Nenhum registro encontrado.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}

"use client";
import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Card, PageIntro } from "@/components/ui";
import { RegisterTable } from "./register-table";
import type { RegisterRow } from "@/lib/financeiro/dimensoes/types";

type Props<T extends RegisterRow> = {
  title: string;
  rows: T[];
  form: (row: T | null) => ReactNode;
  extra?: (row: T) => ReactNode;
  save: (
    id: string | null,
    form: FormData,
  ) => Promise<{ error: string | null }>;
};
export function RegisterEditor<T extends RegisterRow>({
  title,
  rows,
  form,
  save,
  extra,
}: Props<T>) {
  const router = useRouter();
  const [selected, setSelected] = useState<T | null | undefined>();
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const visible = rows.filter((row) =>
    `${row.code} ${row.name}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="mx-auto max-w-[1460px]">
      <PageIntro
        crumbs={[
          { label: "Configurações", href: "/ajustes" },
          { label: "Financeiro", href: "/ajustes/financeiro" },
          { label: title },
        ]}
        title={title}
        subtitle="Cadastros da empresa atual"
      />
      <Card className="mt-6 p-5">
        <div className="flex gap-3">
          <input
            aria-label="Pesquisar cadastro"
            className="input flex-1"
            placeholder="Pesquisar código ou nome"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            variant="primary"
            onClick={() => {
              setError("");
              setSelected(null);
            }}
          >
            Novo cadastro
          </Button>
        </div>
      </Card>
      <Card className="mt-4 overflow-hidden">
        <RegisterTable
          rows={visible}
          onEdit={(row) => {
            setError("");
            setSelected(row);
          }}
        />
      </Card>
      {selected !== undefined && (
        <Modal
          open
          title={
            selected
              ? `Editar ${title.toLowerCase()}`
              : `Novo cadastro — ${title}`
          }
          width="max-w-5xl"
          onClose={() => {
            if (!pending) setSelected(undefined);
          }}
        >
          <form
            key={selected?.id ?? "new"}
            className="space-y-4 pt-4"
            onSubmit={async (event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              setPending(true);
              setError("");
              try {
                const result = await save(selected?.id ?? null, data);
                if (result.error) setError(result.error);
                else {
                  setSelected(undefined);
                  router.refresh();
                }
              } catch {
                setError("Não foi possível salvar. Tente novamente.");
              } finally {
                setPending(false);
              }
            }}
          >
            <fieldset disabled={pending} className="space-y-4">
              {form(selected)}
            </fieldset>
            {error && (
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                disabled={pending}
                onClick={() => setSelected(undefined)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={pending}>
                {pending ? "Salvando…" : "Salvar"}
              </Button>
            </div>
          </form>
          {selected && extra?.(selected)}
        </Modal>
      )}
    </div>
  );
}

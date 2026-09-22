"use client";
import { useEffect, useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, PageIntro } from "@/components/ui";
type Row = {
  id: string;
  code: string;
  name: string;
  detail: string;
  active: boolean;
};
export function FinancialRegisterScreen({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const key = `poolcontrol:financial-register:${slug}`,
    [rows, setRows] = useState<Row[]>([]),
    [query, setQuery] = useState(""),
    [creating, setCreating] = useState(false);
  useEffect(
    () => setRows(JSON.parse(localStorage.getItem(key) || "[]")),
    [key],
  );
  const visible = useMemo(
    () =>
      rows.filter((row) =>
        `${row.code} ${row.name} ${row.detail}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [rows, query],
  );
  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget),
      next = [
        ...rows,
        {
          id: crypto.randomUUID(),
          code: String(data.get("code") || ""),
          name: String(data.get("name") || ""),
          detail: String(data.get("detail") || ""),
          active: true,
        },
      ];
    localStorage.setItem(key, JSON.stringify(next));
    setRows(next);
    setCreating(false);
  }
  return (
    <div className="mx-auto max-w-[1460px]">
      <PageIntro
        crumbs={[
          { label: "Início", href: "/inicio" },
          { label: "Configurações", href: "/ajustes" },
          { label: "Financeiro", href: "/ajustes/financeiro" },
          { label: title },
        ]}
        title={title}
        subtitle={`Consulte e mantenha os registros de ${title.toLowerCase()}.`}
      />
      <Card className="mt-6 p-5">
        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-64 flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />
            <input
              className="input w-full !pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar por código ou descrição"
            />
          </div>
          <Button variant="primary" onClick={() => setCreating(true)}>
            <Plus size={16} /> Novo cadastro
          </Button>
        </div>
      </Card>
      {creating && (
        <Card className="mt-4 p-5">
          <form
            onSubmit={save}
            className="grid gap-4 md:grid-cols-[180px_1fr_1fr_auto]"
          >
            <label className="text-sm font-bold">
              Código
              <input
                className="input mt-1 w-full"
                name="code"
                required
                autoFocus
              />
            </label>
            <label className="text-sm font-bold">
              Descrição
              <input className="input mt-1 w-full" name="name" required />
            </label>
            <label className="text-sm font-bold">
              {slug === "favorecidos-pix" ? "Chave PIX" : "Detalhes"}
              <input className="input mt-1 w-full" name="detail" />
            </label>
            <div className="flex items-end gap-2">
              <Button type="submit" variant="primary">
                Salvar
              </Button>
              <Button onClick={() => setCreating(false)}>
                <X size={16} />
              </Button>
            </div>
          </form>
        </Card>
      )}
      <Card className="mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="tbl w-full min-w-[700px]">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th>Detalhes</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id}>
                  <td className="font-bold">{row.code}</td>
                  <td>{row.name}</td>
                  <td>{row.detail || "—"}</td>
                  <td>{row.active ? "Ativo" : "Inativo"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!visible.length && (
          <p className="p-8 text-center text-sm text-ink-500">
            Nenhum registro cadastrado.
          </p>
        )}
      </Card>
    </div>
  );
}

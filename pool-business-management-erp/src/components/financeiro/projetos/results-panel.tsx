"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getProjectResult,
  type ProjectResult,
} from "@/lib/financeiro/projetos/get-result";
import {
  getProjectReceipts,
  type ProjectReceipt,
} from "@/lib/financeiro/projetos/get-receipts";
import { linkProjectReceipt } from "@/lib/financeiro/projetos/link-receipt";
export function ProjectResultsPanel({ id }: { id: string }) {
  const [result, setResult] = useState<ProjectResult | null>(null);
  const [receipts, setReceipts] = useState<ProjectReceipt[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  useEffect(() => {
    let alive = true;
    Promise.all([getProjectResult(id), getProjectReceipts(id)])
      .then(([summary, rows]) => {
        if (alive) {
          setResult(summary);
          setReceipts(rows);
        }
      })
      .catch(() => {
        if (alive) setError("Não foi possível carregar o resultado.");
      });
    return () => {
      alive = false;
    };
  }, [id]);
  const metrics = result
    ? ([
        ["Contrato", result.contract],
        ["Custo orçado", result.budget],
        ["Custo realizado", result.cost],
        ["Receita realizada", result.revenue],
        ["Margem atual", Number(result.revenue) - Number(result.cost)],
      ] as const)
    : [];
  return (
    <section className="mt-5 space-y-4 border-t pt-4">
      <h3 className="font-bold">Resultado do projeto</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="font-bold">
              {Number(value).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500">
        Receita e custo realizados consideram os títulos pagos vinculados ao
        projeto.
      </p>
      <form
        className="flex gap-3"
        onSubmit={async (event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setPending(true);
          setError("");
          try {
            const response = await linkProjectReceipt(
              id,
              String(data.get("receipt")),
            );
            if (response.error) setError(response.error);
            else {
              setResult(await getProjectResult(id));
              setReceipts(await getProjectReceipts(id));
            }
          } catch {
            setError("Não foi possível vincular a receita.");
          } finally {
            setPending(false);
          }
        }}
      >
        <select
          name="receipt"
          aria-label="Receita a vincular"
          required
          className="input flex-1"
          defaultValue=""
        >
          <option value="">Selecione uma conta a receber existente</option>
          {receipts
            .filter((row) => !row.projectId)
            .map((row) => (
              <option key={row.id} value={row.id}>
                {row.name} — {Number(row.amount).toFixed(2)}
              </option>
            ))}
        </select>
        <Button type="submit" disabled={pending}>
          Vincular receita
        </Button>
      </form>
      <ul className="text-sm text-slate-600">
        {receipts
          .filter((row) => String(row.projectId) === id)
          .map((row) => (
            <li key={row.id}>
              {row.name} · {row.status === "PAID" ? "Recebido" : "Pendente"} ·{" "}
              {Number(row.amount).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </li>
          ))}
      </ul>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </section>
  );
}

"use client";
import { useEffect, useState } from "react";
import {
  getDimensionHistory,
  type HistoryRow,
} from "@/lib/financeiro/dimensoes/get-history";
export function HistoryPanel({ route, id }: { route: string; id: string }) {
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    getDimensionHistory(route, id)
      .then((data) => {
        if (alive) setRows(data);
      })
      .catch(() => {
        if (alive) setError("Não foi possível carregar o histórico.");
      });
    return () => {
      alive = false;
    };
  }, [route, id]);
  return (
    <details className="mt-5 border-t pt-4">
      <summary className="cursor-pointer font-bold">
        Histórico de alterações
      </summary>
      {error && <p role="alert">{error}</p>}
      <ul className="mt-3 space-y-2">
        {rows.map((row) => (
          <li key={row.id} className="rounded-lg border p-3 text-sm">
            <strong>{row.userName}</strong> ·{" "}
            {new Date(row.occurredAt).toLocaleString("pt-BR")}
            <span className="ml-2 text-slate-500">Cadastro salvo</span>
          </li>
        ))}
      </ul>
      {!rows.length && !error && (
        <p className="py-3 text-sm text-slate-500">
          Sem alterações registradas nesta versão.
        </p>
      )}
    </details>
  );
}

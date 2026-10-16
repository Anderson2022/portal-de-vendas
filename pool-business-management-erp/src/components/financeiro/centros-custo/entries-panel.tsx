"use client";
import { useEffect, useState } from "react";
import {
  getCenterEntries,
  type CenterEntry,
} from "@/lib/financeiro/centros-custo/get-entries";
export function CenterEntriesPanel({ id }: { id: string }) {
  const [rows, setRows] = useState<CenterEntry[]>([]);
  const [period, setPeriod] = useState("");
  const [onlyAllocations, setOnlyAllocations] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    getCenterEntries(id)
      .then((data) => {
        if (alive) setRows(data);
      })
      .catch(() => {
        if (alive) setError("Não foi possível carregar os lançamentos.");
      });
    return () => {
      alive = false;
    };
  }, [id]);
  const visible = rows.filter(
    (row) =>
      (!period || row.competenceDate.startsWith(period)) &&
      (!onlyAllocations || row.percentage != null),
  );
  return (
    <details className="mt-5 border-t pt-4">
      <summary className="cursor-pointer font-bold">
        Lançamentos e rateios
      </summary>
      <div className="my-3 flex gap-4">
        <label className="text-sm">
          Competência
          <input
            className="input ml-2"
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyAllocations}
            onChange={(e) => setOnlyAllocations(e.target.checked)}
          />
          Somente rateios
        </label>
      </div>
      {error && <p role="alert">{error}</p>}
      <div className="overflow-x-auto">
        <table className="tbl w-full">
          <thead>
            <tr>
              <th>Vencimento</th>
              <th>Descrição</th>
              <th>Situação</th>
              <th>Rateio</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id}>
                <td>{row.dueDate}</td>
                <td>{row.description}</td>
                <td>
                  {row.status === "PAID"
                    ? "Pago"
                    : row.status === "PENDING"
                      ? "Pendente"
                      : row.status}
                </td>
                <td>{row.percentage == null ? "—" : `${row.percentage}%`}</td>
                <td>
                  {Number(row.amount).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

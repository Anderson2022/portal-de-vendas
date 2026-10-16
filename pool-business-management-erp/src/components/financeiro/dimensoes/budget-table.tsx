import type { BudgetRow } from "@/lib/financeiro/dimensoes/budget-types";
const money = (value: number) =>
  Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export function BudgetTable({ rows }: { rows: BudgetRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="tbl w-full">
        <thead>
          <tr>
            <th>Competência / classificação</th>
            <th>Orçado</th>
            <th>Revisado</th>
            <th>Realizado</th>
            <th>Comprometido</th>
            <th>Disponível</th>
            <th>Execução</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const budget = Number(row.revised ?? row.planned);
            const available =
              budget - Number(row.realized) - Number(row.committed);
            return (
              <tr key={row.id}>
                <td>
                  {row.period
                    ? row.period.slice(0, 7)
                    : `${row.accountName} / ${row.centerName}`}
                </td>
                <td>{money(row.planned)}</td>
                <td>{row.revised == null ? "—" : money(row.revised)}</td>
                <td>{money(row.realized)}</td>
                <td>{money(row.committed)}</td>
                <td
                  className={
                    available < 0 ? "text-red-700" : "text-emerald-700"
                  }
                >
                  {money(available)}
                </td>
                <td>
                  {budget
                    ? `${((Number(row.realized) / budget) * 100).toFixed(2)}%`
                    : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!rows.length && (
        <p className="py-4 text-sm text-slate-500">
          Nenhum orçamento configurado.
        </p>
      )}
    </div>
  );
}

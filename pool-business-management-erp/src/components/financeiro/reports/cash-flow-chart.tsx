"use client";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FlowRow } from "@/lib/financeiro/cash-flow";
export function CashFlowChart({ rows }: { rows: FlowRow[] }) {
  // Number conversion is solely for chart rendering, never accounting arithmetic.
  const data = rows.map((row) => ({
    ...row,
    incoming: Number(row.incoming),
    outgoing: Number(row.outgoing),
    accumulated: Number(row.accumulated),
  }));
  return (
    <div
      className="h-72 min-w-0"
      role="img"
      aria-label="Evolução de entradas, saídas e resultado acumulado. Valores exatos na tabela."
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid stroke="var(--fin-border)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickFormatter={(value) =>
              String(value).slice(5).split("-").reverse().join("/")
            }
          />
          <YAxis width={75} tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value) =>
              Number(value).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }
          />
          <Legend />
          <Bar dataKey="incoming" name="Entradas" fill="var(--fin-positive)" />
          <Bar dataKey="outgoing" name="Saídas" fill="var(--fin-negative)" />
          <Line
            dataKey="accumulated"
            name="Resultado acumulado"
            stroke="var(--fin-accent)"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

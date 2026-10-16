import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui";
import type { ChartAccountRow } from "@/lib/financeiro/plano-contas/types";
export function ChartAccountChildren({ rows }: { rows: ChartAccountRow[] }) {
  return (
    <Card className="mt-4 p-5">
      <div className="flex justify-between">
        <h2 className="font-extrabold">Contas filhas ({rows.length})</h2>
        <Button>+ Nova conta filha</Button>
      </div>
      {rows.length ? (
        <ul className="mt-4 divide-y">
          {rows.map((row) => (
            <li key={row.id} className="py-3">
              <Link
                href={`/ajustes/financeiro/categoria-plano-contas/${row.id}`}
              >
                {row.code} — {row.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-8 text-center text-sm text-ink-500">
          Nenhuma conta filha cadastrada.
        </p>
      )}
    </Card>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { accountTree } from "@/lib/financeiro/plano-contas/account-tree";

export function ChartAccountTable({
  rows,
  collapsed,
  toggle,
  searching,
}: {
  rows: ReturnType<typeof accountTree>;
  collapsed: Set<string>;
  searching: boolean;
  toggle: (id: string) => void;
}) {
  const router = useRouter();
  return (
    <div className="overflow-x-auto">
      <table className="tbl w-full min-w-[900px]">
        <thead>
          <tr>
            {[
              "Código",
              "Código reduzido",
              "Descrição",
              "Conta pai",
              "Tipo",
              "Natureza",
              "Situação",
            ].map((label) => (
              <th key={label}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ account: row, depth, hasChildren }) => (
            <tr
              key={row.id}
              className="cursor-pointer hover:bg-water-50"
              tabIndex={0}
              aria-label={`Editar ${row.code} — ${row.name}`}
              onDoubleClick={() =>
                router.push(
                  `/ajustes/financeiro/categoria-plano-contas/${row.id}`,
                )
              }
              onKeyDown={(event) => {
                if (
                  event.target === event.currentTarget &&
                  event.key === "Enter"
                )
                  router.push(
                    `/ajustes/financeiro/categoria-plano-contas/${row.id}`,
                  );
              }}
            >
              <td className="font-bold">
                <div
                  className="flex items-center gap-1"
                  style={{ paddingLeft: depth * 20 }}
                >
                  {hasChildren ? (
                    <button
                      type="button"
                      disabled={searching}
                      className="rounded p-1 hover:bg-black/5"
                      aria-label={`${collapsed.has(row.id) ? "Expandir" : "Recolher"} ${row.code}`}
                      aria-expanded={!collapsed.has(row.id)}
                      onDoubleClick={(event) => event.stopPropagation()}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggle(row.id);
                      }}
                    >
                      {collapsed.has(row.id) ? (
                        <ChevronRight size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  ) : (
                    <span className="w-6 shrink-0" />
                  )}
                  {row.code}
                </div>
              </td>
              <td>{row.shortCode}</td>
              <td>{row.name}</td>
              <td>{row.parentName || "—"}</td>
              <td>{row.accountType || "—"}</td>
              <td>{row.nature || "—"}</td>
              <td>
                <span
                  className={row.active ? "text-green-700" : "text-red-700"}
                >
                  {row.active ? "Ativa" : "Inativa"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

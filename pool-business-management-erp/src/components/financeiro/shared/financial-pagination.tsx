import Link from "next/link";
import type { FinancialFilters, PageResult } from "@/lib/financeiro/types";
export function FinancialPagination({ result, filters, path }: {
    result: PageResult<unknown>;
    filters: FinancialFilters;
    path: string;
}) {
    const href = (page: number) => `${path}?${new URLSearchParams(Object.entries({ ...filters, page }).map(([key, value]) => [key, String(value)]))}`;
    return <nav className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm" aria-label="Paginação"><span className="fin-muted">{result.totalElements} registros · Página {result.page + 1} de {Math.max(1, result.totalPages)}</span><div className="flex gap-2">{result.page > 0 && <Link className="fin-button" href={href(result.page - 1)}>Anterior</Link>}{result.page + 1 < result.totalPages && <Link className="fin-button" href={href(result.page + 1)}>Próxima</Link>}</div></nav>;
}

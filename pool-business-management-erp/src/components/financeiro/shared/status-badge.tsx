import type { FinancialTitle } from "@/lib/financeiro/types";
import { titleStatus } from "@/lib/financeiro/filter-titles";
export function StatusBadge({ title }: {
    title: FinancialTitle;
}) {
    const status = titleStatus(title);
    const labels = { PENDING: "Pendente", PAID: title.kind === "payable" ? "Pago" : "Recebido", OVERDUE: "Vencido", CANCELLED: "Cancelado" };
    return <span className={`fin-badge fin-status-${status.toLowerCase()}`}>{labels[status]}</span>;
}

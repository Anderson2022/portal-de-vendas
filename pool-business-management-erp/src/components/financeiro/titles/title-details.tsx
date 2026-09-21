"use client";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import { currency } from "@/lib/financeiro/money";
import { displayDate } from "@/lib/financeiro/dates";
import type { FinancialTitle } from "@/lib/financeiro/types";
import { StatusBadge } from "../shared/status-badge";
export function TitleDetails({ title, onClose }: {
    title: FinancialTitle;
    onClose: () => void;
}) {
    return <Modal open onClose={onClose} title={`Título #${title.id}`} width="max-w-2xl"><div className="space-y-5 pt-4"><StatusBadge title={title}/><h3 className="text-xl font-bold">{title.description}</h3><dl className="grid grid-cols-2 gap-5 text-sm">{[["Valor original", currency(title.amount)], ["Vencimento", displayDate(title.dueDate)], ["Pessoa vinculada", title.party], ["Forma de pagamento", title.paymentMethod || "Não informada"], ["Quitação", displayDate(title.paidAt)]].map(([key, value]) => <div key={key}><dt className="text-ink-500">{key}</dt><dd className="mt-1 font-semibold">{value}</dd></div>)}</dl>{title.sourceType === "SALE" && title.sourceId && <Link className="btn btn-primary" href={`/vendas/pedidos/${title.sourceId}`}>Ver venda #{title.sourceId}</Link>}<section className="border-t border-ink-100 pt-4"><h4 className="font-bold">Histórico disponível</h4><ol className="mt-3 space-y-2 text-sm">{title.createdAt && <li>{displayDate(title.createdAt)} · Título criado</li>}{title.paidAt && <li>{displayDate(title.paidAt)} · Quitação integral registrada</li>}{!title.createdAt && !title.paidAt && <li>Nenhum evento informado.</li>}</ol><p className="mt-3 text-xs text-ink-500">Histórico detalhado, anexos e estornos ainda não estão disponíveis.</p></section></div></Modal>;
}

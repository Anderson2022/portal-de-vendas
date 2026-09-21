import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import type { FinancialCapability } from "@/lib/financeiro/types";
import { FinancialHeader } from "./financial-header";
export function CapabilityPending({ capability }: {
    capability: FinancialCapability;
}) {
    return <><FinancialHeader title={capability.label} description={capability.description}/><section className="fin-panel"><div className="flex items-start gap-3"><LockKeyhole className="fin-muted shrink-0"/><div><h2 className="font-bold">Funcionalidade ainda indisponível</h2><p className="fin-muted mt-2 max-w-2xl text-sm">A integração atual não fornece os dados e operações necessários para esta funcionalidade. Nenhuma operação financeira será registrada nesta tela.</p></div></div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{capability.fields.map(field => <div className="fin-subtle rounded-xl p-4" key={field}><p className="text-sm font-semibold">{field}</p><p className="fin-muted mt-2 text-sm">Não disponível</p></div>)}</div><Link href="/financeiro" className="fin-button mt-6 inline-flex">Voltar à visão geral</Link></section></>;
}

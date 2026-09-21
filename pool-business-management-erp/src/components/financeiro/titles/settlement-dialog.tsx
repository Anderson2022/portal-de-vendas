"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/financeiro/money";
import { displayDate } from "@/lib/financeiro/dates";
import { settleTitle } from "@/lib/financeiro/services/settle-title";
import type { FinancialTitle } from "@/lib/financeiro/types";
export function SettlementDialog({ title, onClose, onSuccess }: {
    title: FinancialTitle;
    onClose: () => void;
    onSuccess: (message: string) => void;
}) {
    const router = useRouter(), lock = useRef(false);
    const [pending, setPending] = useState(false), [error, setError] = useState("");
    async function submit() {
        if (lock.current)
            return;
        lock.current = true;
        setPending(true);
        setError("");
        try {
            const result = await settleTitle(title.kind, title.id);
            if (result.ok) {
                onSuccess(`${result.message} ${currency(title.amount)}`);
                router.refresh();
                onClose();
            }
            else
                setError(result.message);
        }
        catch {
            setError("Conexão interrompida. Atualize a lista para conferir o resultado antes de repetir.");
        }
        finally {
            lock.current = false;
            setPending(false);
        }
    }
    return <Modal open onClose={() => { if (!pending)
        onClose(); }} title={title.kind === "payable" ? "Confirmar pagamento integral" : "Confirmar recebimento integral"}><div className="space-y-4 pt-4"><p className="font-bold">{title.description}</p><p className="text-sm">{title.party} · Vencimento {displayDate(title.dueDate)}</p><p className="text-3xl font-extrabold">{currency(title.amount)}</p><p className="text-sm text-ink-700">O título será quitado integralmente na data atual. Confirme somente se o dinheiro já foi pago ou recebido.</p><p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Pagamentos parciais, conta bancária e estorno não estão disponíveis nesta integração.</p>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<div className="flex justify-end gap-2"><Button disabled={pending} onClick={onClose}>Voltar</Button><Button variant="primary" disabled={pending} onClick={submit}>{pending ? "Registrando…" : "Confirmar quitação"}</Button></div></div></Modal>;
}

"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { createPayable } from "@/lib/financeiro/services/create-payable";
import { today } from "@/lib/financeiro/dates";
import { Can } from "../shared/financial-context";
export function CreatePayableDialog({ suppliers = [] }: {
    suppliers?: Array<{
        id: string;
        name: string;
    }>;
}) {
    const [open, setOpen] = useState(false), [pending, setPending] = useState(false), [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const lock = useRef(false);
    const router = useRouter();
    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (lock.current)
            return;
        lock.current = true;
        setPending(true);
        setError("");
        const form = new FormData(event.currentTarget);
        try {
            const result = await createPayable(form);
            if (result.ok) {
                setOpen(false);
                setMessage(result.message);
                router.refresh();
            }
            else
                setError(result.message);
        }
        catch {
            setError("Conexão interrompida. Consulte a lista antes de repetir o cadastro.");
        }
        finally {
            lock.current = false;
            setPending(false);
        }
    }
    return <Can action="create"><button className="fin-button fin-primary" onClick={() => { setError(""); setMessage(""); setOpen(true); }}>+ Nova conta a pagar</button>{message && <p role="status" className="fin-notice">{message}</p>}<Modal open={open} onClose={() => { if (!pending)
        setOpen(false); }} title="Nova conta a pagar" width="max-w-xl"><form onSubmit={submit} className="space-y-4 pt-4"><fieldset disabled={pending} className="space-y-4"><label className="block text-sm font-semibold">Descrição<input className="input mt-1 w-full" name="description" required maxLength={220} autoFocus/></label><label className="block text-sm font-semibold">Fornecedor<select name="supplierId" className="input mt-1 w-full"><option value="">Sem fornecedor vinculado</option>{suppliers.map(supplier => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}</select></label><div className="grid grid-cols-2 gap-3"><label className="block text-sm font-semibold">Valor original (R$)<input className="input mt-1 w-full" name="amount" inputMode="decimal" placeholder="1.234,56" required/></label><label className="block text-sm font-semibold">Vencimento<input className="input mt-1 w-full" name="dueDate" type="date" defaultValue={today()} required/></label></div></fieldset><p className="text-xs text-ink-500">Título avulso da empresa atual. Rateio, parcelamento, categorias e anexos dependem da ampliação da integração.</p>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<div className="flex justify-end gap-2"><Button disabled={pending} onClick={() => setOpen(false)}>Cancelar</Button><Button type="submit" variant="primary" disabled={pending}>{pending ? "Salvando…" : "Salvar título"}</Button></div></form></Modal></Can>;
}

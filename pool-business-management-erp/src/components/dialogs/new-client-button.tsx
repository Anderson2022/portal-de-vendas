"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/clientes/create-client";
import { Modal as Overlay } from "../ui/modal";
import { Field } from "../ui/field";
export function NewClientButton({
  label = "Novo cliente", variant = "neu", className,
}: {
  label?: string; variant?: "neu" | "primary" | "text"; className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <>
      <Button variant="unstyled" type="submit"
        onClick={() => setOpen(true)}
        className={variant === "text"
          ? `flex items-center gap-1.5 text-[13px] font-bold text-water-600 hover:text-water-700 ${className ?? ""}`
          : `btn ${variant === "primary" ? "btn-primary" : "btn-neu"} ${className ?? ""}`}
      >
        <UserPlus size={16} strokeWidth={2.4} />
        {label}
      </Button>
      <Overlay open={open} onClose={() => setOpen(false)} title="Novo cliente">
        {done ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 size={44} className="text-mint-500" />
            <div className="text-[15px] font-extrabold text-ink-900">Cliente cadastrado com sucesso</div>
            <p className="text-[13px] font-medium text-ink-300">Ele já aparece na listagem de clientes.</p>
          </div>
        ) : (
          <form
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              start(async () => {
                await createClient(fd);
                setDone(true);
                router.refresh();
                setTimeout(() => { setOpen(false); setDone(false); }, 1100);
              });
            }}
          >
            <div className="sm:col-span-2"><Field label="Nome completo"><Input required name="name" className="input" placeholder="Ex.: Marina Duarte" /></Field></div>
            <Field label="Telefone"><Input name="phone" className="input" placeholder="(11) 9 0000-0000" /></Field>
            <Field label="E-mail"><Input name="email" type="email" className="input" placeholder="cliente@email.com" /></Field>
            <Field label="CPF / CNPJ"><Input name="document" className="input" placeholder="000.000.000-00" /></Field>
            <Field label="Estado"><Input name="state" className="input" placeholder="SP" maxLength={2} /></Field>
            <div className="sm:col-span-2"><Field label="Endereço"><Input name="address" className="input" placeholder="Rua, número, bairro" /></Field></div>
            <div className="sm:col-span-2"><Field label="Cidade"><Input name="city" className="input" placeholder="Campinas" /></Field></div>
            <div className="flex justify-end gap-2 sm:col-span-2">
              <Button variant="unstyled" type="button" onClick={() => setOpen(false)} className="btn btn-neu">Cancelar</Button>
              <Button variant="unstyled" type="submit" disabled={pending} className="btn btn-primary">
                {pending ? "Salvando…" : "Cadastrar cliente"}
              </Button>
            </div>
          </form>
        )}
      </Overlay>
    </>
  );
}

/* ── Movimentação de estoque ── */

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PackagePlus, CheckCircle2 } from "lucide-react";
import { createStockMovement } from "@/lib/estoque/create-stock-movement";
import { Modal as Overlay } from "../ui/modal";
import { Field } from "../ui/field";
export function StockMovementButton({ products }: { products: { id: string; name: string }[] }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <>
      <Button variant="unstyled" type="submit" onClick={() => setOpen(true)} className="btn btn-primary">
        <PackagePlus size={16} strokeWidth={2.4} />
        Cadastrar Produto
      </Button>
      <Overlay open={open} onClose={() => setOpen(false)} title="Cadastrar Produto">
        {done ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 size={44} className="text-mint-500" />
            <div className="text-[15px] font-extrabold text-ink-900">Movimentação registrada</div>
            <p className="text-[13px] font-medium text-ink-300">O saldo e o histórico foram atualizados.</p>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              start(async () => {
                await createStockMovement(fd);
                setDone(true);
                router.refresh();
                setTimeout(() => { setOpen(false); setDone(false); }, 1100);
              });
            }}
          >
            <Field label="Produto">
              <Select name="productId" className="input" defaultValue={products[0]?.id}>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tipo">
                <Select name="type" className="input" defaultValue="ENTRADA">
                  <option value="ENTRADA">Entrada (+)</option>
                  <option value="SAIDA">Saída (−)</option>
                  <option value="AJUSTE">Ajuste de inventário</option>
                </Select>
              </Field>
              <Field label="Quantidade">
                <Input required name="quantity" type="number" min={1} className="input" placeholder="10" />
              </Field>
            </div>
            <Field label="Motivo / referência">
              <Input name="reason" className="input" placeholder="Ex.: Compra NF 91.220, inventário, venda…" />
            </Field>
            <div className="flex justify-end gap-2">
              <Button variant="unstyled" type="button" onClick={() => setOpen(false)} className="btn btn-neu">Cancelar</Button>
              <Button variant="unstyled" type="submit" disabled={pending} className="btn btn-primary">
                {pending ? "Salvando…" : "Registrar"}
              </Button>
            </div>
          </form>
        )}
      </Overlay>
    </>
  );
}

/* ── Simulador de comissão por margem ── */

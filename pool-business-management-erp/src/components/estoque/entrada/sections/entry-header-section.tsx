import { CalendarDays, FileText } from "lucide-react";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function EntryHeaderSection() {
  return (
    <section className="rounded-[22px] border border-white/70 bg-white/70 p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 shadow-inner">
          <FileText size={17} />
        </div>

        <div>
          <h3 className="text-[14px] font-extrabold text-ink-900">
            Cabeçalho
          </h3>
          <p className="text-[12px] text-ink-300">
            Dados principais da entrada de estoque.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-2">
          <Field label="Código">
            <Input name="code" className="input" placeholder="Automático" />
          </Field>
        </div>

        <div className="col-span-3">
          <Field label="Tipo">
            <Select name="operationType" className="input" defaultValue="COMPRA">
              <option value="COMPRA">Compra de fornecedor</option>
              <option value="DEVOLUCAO">Devolução</option>
              <option value="AJUSTE">Ajuste positivo</option>
              <option value="TRANSFERENCIA">Transferência recebida</option>
              <option value="OUTRO">Outra entrada</option>
            </Select>
          </Field>
        </div>

        <div className="col-span-2">
          <Field label="Nº Nota">
            <Input name="invoiceNumber" className="input" />
          </Field>
        </div>

        <div className="col-span-2">
          <Field label="Data de emissão">
            <Input name="issueDate" type="date" className="input" />
          </Field>
        </div>

        <div className="col-span-2">
          <Field label="Data da entrada">
            <Input name="entryDate" type="date" className="input" />
          </Field>
        </div>

        <div className="col-span-1">
          <Field label="Hora">
            <Input name="entryTime" type="time" className="input" />
          </Field>
        </div>

        <div className="col-span-12 flex items-center gap-2">
          <input
            id="invoiceOk"
            name="invoiceOk"
            type="checkbox"
            defaultChecked
            className="size-4"
          />
          <label
            htmlFor="invoiceOk"
            className="text-[12px] font-bold text-ink-700"
          >
            Nota conferida / OK
          </label>
        </div>
      </div>
    </section>
  );
}

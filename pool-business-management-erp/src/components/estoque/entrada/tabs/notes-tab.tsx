import { Field } from "@/components/ui/field";

export function NotesTab() {
  return (
    <div className="space-y-4 rounded-[22px] border border-white/70 bg-white/70 p-5 shadow-sm">
      <Field label="Observação interna">
        <textarea
          name="internalNotes"
          rows={4}
          className="input min-h-[100px] w-full resize-none"
        />
      </Field>

      <Field label="Observação fiscal">
        <textarea
          name="fiscalNotes"
          rows={4}
          className="input min-h-[100px] w-full resize-none"
        />
      </Field>

      <Field label="Observação do fornecedor">
        <textarea
          name="supplierNotes"
          rows={4}
          className="input min-h-[100px] w-full resize-none"
        />
      </Field>
    </div>
  );
}

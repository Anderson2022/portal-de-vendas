export function PayableDocumentsSection() {
  return (
    <section className="space-y-5">
      <header>
        <h3 className="text-lg font-extrabold">Documentos e observações</h3>
        <p className="text-sm text-slate-500">
          Centralize os documentos relacionados ao título.
        </p>
      </header>
      <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/60 p-6 text-center">
        <strong>Anexar NF, boleto ou contrato</strong>
        <span className="mt-1 text-sm text-slate-500">
          Selecione um ou mais arquivos
        </span>
        <input
          className="sr-only"
          name="attachments"
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.xml"
        />
      </label>
      <label className="block text-sm font-semibold">
        Observações
        <textarea
          className="input mt-1 min-h-36 w-full resize-y"
          name="notes"
          maxLength={2000}
        />
      </label>
      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
        <strong className="text-slate-700">Histórico e auditoria</strong>
        <p className="mt-1">
          O histórico será iniciado depois que a conta for cadastrada.
        </p>
      </div>
    </section>
  );
}

import { today } from "@/lib/financeiro/dates";

export function PayableTitleSection({
  suppliers,
}: {
  suppliers: Array<{ id: string; name: string }>;
}) {
  return (
    <section className="space-y-5">
      <header>
        <h3 className="text-lg font-extrabold">Informações do título</h3>
        <p className="text-sm text-slate-500">
          Identifique a obrigação financeira.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold">
          Descrição *
          <input
            className="input mt-1 w-full"
            name="description"
            required
            maxLength={220}
            autoFocus
          />
        </label>
        <label className="text-sm font-semibold">
          Fornecedor / favorecido
          <select name="supplierId" className="input mt-1 w-full">
            <option value="">Sem fornecedor vinculado</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm font-semibold">
          Número do documento
          <input className="input mt-1 w-full" name="documentNumber" />
        </label>
        <label className="text-sm font-semibold">
          Tipo de documento
          <select className="input mt-1 w-full" name="documentType">
            <option>Nota fiscal</option>
            <option>Boleto</option>
            <option>Recibo</option>
            <option>Contrato</option>
            <option>Outro</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Data de emissão
          <input
            className="input mt-1 w-full"
            name="issueDate"
            type="date"
            defaultValue={today()}
          />
        </label>
        <label className="text-sm font-semibold">
          Competência
          <input
            className="input mt-1 w-full"
            name="competence"
            type="month"
            defaultValue={today().slice(0, 7)}
          />
        </label>
      </div>
      <label className="block text-sm font-semibold">
        Observação curta
        <textarea
          className="input mt-1 min-h-28 w-full resize-y"
          name="shortNote"
          maxLength={500}
        />
      </label>
    </section>
  );
}

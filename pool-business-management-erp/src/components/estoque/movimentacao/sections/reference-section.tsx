import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

import type { Option, StockMovementType } from "../movement-types";

type Props = {
  suppliers: Option[];
  movementType: StockMovementType;
};

export function ReferenceSection({
  suppliers,
  movementType,
}: Props) {
  const showSupplier = movementType === "ENTRADA";

  return (
    <div className="grid grid-cols-2 gap-4">
      <Field label="Documento / referência">
        <Input
          name="referenceId"
          className="input"
          placeholder="Ex.: NF 91.220, OS 450, Venda 1024..."
        />
      </Field>

      {showSupplier ? (
        <Field label="Fornecedor">
          <Select
            name="supplierId"
            className="input"
            defaultValue=""
          >
            <option value="">Sem fornecedor</option>

            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </Select>
        </Field>
      ) : (
        <Field label="Motivo">
          <Select
            name="reasonType"
            className="input"
            defaultValue=""
          >
            <option value="">Selecione</option>
            <option value="VENDA">Venda</option>
            <option value="OS">Ordem de serviço</option>
            <option value="PERDA">Perda / avaria</option>
            <option value="INVENTARIO">Inventário</option>
            <option value="DEVOLUCAO">Devolução</option>
            <option value="TRANSFERENCIA">Transferência</option>
            <option value="OUTRO">Outro</option>
          </Select>
        </Field>
      )}
    </div>
  );
}

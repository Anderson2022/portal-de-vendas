import { Building2 } from "lucide-react";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

import type { Option } from "../stock-entry-types";

type Props = {
  suppliers: Option[];
  warehouses: Option[];
  costCenters: Option[];
};

export function SupplierOperationSection({
  suppliers,
  warehouses,
  costCenters,
}: Props) {
  return (
    <section className="rounded-[22px] border border-white/70 bg-white/70 p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 shadow-inner">
          <Building2 size={17} />
        </div>

        <div>
          <h3 className="text-[14px] font-extrabold text-ink-900">
            Fornecedor e operação
          </h3>
          <p className="text-[12px] text-ink-300">
            Origem, depósito e classificação da entrada.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-5">
          <Field label="Fornecedor">
            <Select name="supplierId" className="input" defaultValue="">
              <option value="">Selecione o fornecedor</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="col-span-3">
          <Field label="CNPJ/CPF">
            <Input
              name="supplierDocument"
              className="input"
              placeholder="00.000.000/0001-00"
            />
          </Field>
        </div>

        <div className="col-span-4">
          <Field label="Inscrição Estadual">
            <Input name="stateRegistration" className="input" />
          </Field>
        </div>

        <div className="col-span-4">
          <Field label="Natureza da operação">
            <Select
              name="operationNature"
              className="input"
              defaultValue="COMPRA_MERCADORIA"
            >
              <option value="COMPRA_MERCADORIA">Compra de mercadoria</option>
              <option value="COMPRA_CONSUMO">Compra para consumo</option>
              <option value="DEVOLUCAO">Devolução</option>
              <option value="BONIFICACAO">Bonificação</option>
              <option value="AJUSTE">Ajuste</option>
            </Select>
          </Field>
        </div>

        <div className="col-span-4">
          <Field label="Centro de custo">
            <Select name="costCenterId" className="input" defaultValue="">
              <option value="">Selecione</option>
              {costCenters.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="col-span-4">
          <Field label="Depósito de destino">
            <Select required name="warehouseId" className="input" defaultValue="">
              <option value="">Selecione</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </div>
    </section>
  );
}

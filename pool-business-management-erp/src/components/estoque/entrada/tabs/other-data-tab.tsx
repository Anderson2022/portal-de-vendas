import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function OtherDataTab() {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-[22px] border border-white/70 bg-white/70 p-5 shadow-sm">
      <Field label="Condição de pagamento">
        <Select name="paymentCondition" className="input" defaultValue="">
          <option value="">Selecione</option>
          <option value="A_VISTA">À vista</option>
          <option value="7_DIAS">7 dias</option>
          <option value="15_DIAS">15 dias</option>
          <option value="30_DIAS">30 dias</option>
          <option value="30_60">30 / 60 dias</option>
        </Select>
      </Field>

      <Field label="Forma de pagamento">
        <Select name="paymentMethod" className="input" defaultValue="">
          <option value="">Selecione</option>
          <option value="PIX">PIX</option>
          <option value="BOLETO">Boleto</option>
          <option value="DINHEIRO">Dinheiro</option>
          <option value="TRANSFERENCIA">Transferência</option>
          <option value="CARTAO">Cartão</option>
        </Select>
      </Field>

      <Field label="Transportadora">
        <Input name="carrier" className="input" />
      </Field>

      <Field label="Responsável pelo lançamento">
        <Input name="responsible" className="input" />
      </Field>
    </div>
  );
}

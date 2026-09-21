import { Select } from "@/components/ui/select";

import type { StockMovementType } from "../movement-types";

type Props = {
  value: StockMovementType;
  onChange: (value: StockMovementType) => void;
};

export function MovementSelect({ value, onChange }: Props) {
  return (
    <Select
      name="type"
      className="input"
      value={value}
      onChange={(event) =>
        onChange(event.target.value as StockMovementType)
      }
    >
      <option value="ENTRADA">Entrada (+)</option>
      <option value="SAIDA">Saída (−)</option>
      <option value="AJUSTE">Ajuste de inventário</option>
      <option value="RESERVA">Reserva</option>
      <option value="LIBERACAO">Liberação de reserva</option>
    </Select>
  );
}

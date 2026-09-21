export type Option = {
  id: string;
  name: string;
};

export type StockMovementType =
  | "ENTRADA"
  | "SAIDA"
  | "AJUSTE"
  | "RESERVA"
  | "LIBERACAO";

export type StockMovementFormProps = {
  products: Option[];
  warehouses: Option[];
  suppliers?: Option[];
  onSuccess?: () => void;
  onCancel?: () => void;
};

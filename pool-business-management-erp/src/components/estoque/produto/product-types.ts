export type Option = {
  id: string;
  name: string;
};

export type ProductType =
  | "STANDARD"
  | "POOL"
  | "MOTOR"
  | "FILTER"
  | "CHEMICAL"
  | "ACCESSORY"
  | "KIT";

export type ProductFormProps = {
  categories: Option[];
  brands: Option[];
  warehouses: Option[];
  suppliers?: Option[];
  onSuccess?: () => void;
  onCancel?: () => void;
  onPendingChange?: (pending: boolean) => void;
  product?: { id: string; values: Record<string, string> };
};

export type ProductTab = "basic" | "prices" | "stock" | "fiscal" | "details" | "media";

export type Option = {
  id: string;
  name: string;
};

export type StockEntryTab =
  | "PRINCIPAL"
  | "OUTROS_DADOS"
  | "OBSERVACOES"
  | "IMAGENS"
  | "ANEXOS";

export type StockEntryItem = {
  id: string;
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  unitCost: number;
  salePrice: number;
  discount: number;
  total: number;
  batchNumber?: string;
  expirationDate?: string;
  serialNumber?: string;
  notes?: string;
};

export type StockEntryFormData = {
  code: string;
  operationType: string;
  invoiceNumber: string;
  issueDate: string;
  entryDate: string;
  entryTime: string;
  invoiceOk: boolean;

  supplierId: string;
  supplierDocument: string;
  stateRegistration: string;

  operationNature: string;
  costCenterId: string;
  warehouseId: string;

  paymentCondition: string;
  paymentMethod: string;
  carrier: string;

  freight: number;
  discount: number;
  otherExpenses: number;

  internalNotes: string;
  fiscalNotes: string;
  supplierNotes: string;

  items: StockEntryItem[];
};

export type StockEntryModalProps = {
  products: Option[];
  suppliers: Option[];
  warehouses: Option[];
  costCenters?: Option[];
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: StockEntryFormData) => Promise<void> | void;
};

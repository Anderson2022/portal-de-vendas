export type HeaderAlert = {
  title: string;
  desc: string;
  tone: string;
};

// Fields consumed from the existing inventory and receivables endpoints.
export type InventoryAlertSummary = {
  productName: string;
  physical: number | string | null;
  reserved: number | string | null;
  minimumStock: number | string | null;
};

export type ReceivableAlertSummary = {
  status: string;
  dueDate: string | null;
};

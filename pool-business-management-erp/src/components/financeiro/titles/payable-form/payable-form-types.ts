export type PayableTab =
  "title" | "values" | "classification" | "payment" | "documents";

export type Allocation = {
  id: string;
  costCenter: string;
  percentage: number;
};

export type PayableFormState = {
  amount: number;
  interest: number;
  fine: number;
  discount: number;
  dueDate: string;
  installmentsEnabled: boolean;
  installments: number;
  intervalDays: number;
  firstDueDate: string;
  allocations: Allocation[];
};

export type InstallmentPreview = {
  number: number;
  dueDate: string;
  amount: number;
};

export type BudgetRow = {
  id: string;
  period?: string;
  accountName?: string;
  centerName?: string;
  planned: number;
  revised?: number | null;
  realized: number;
  committed: number;
  notes?: string;
};

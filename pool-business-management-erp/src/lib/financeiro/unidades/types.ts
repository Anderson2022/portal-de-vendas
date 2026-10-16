export type Unit = {
  id: string;
  code: string;
  name: string;
  parentId: string | null;
  type: string;
  responsibleId: string | null;
  cnpj: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  defaultCostCenterId: string | null;
  defaultBankAccountId: string | null;
  startDate: string | null;
  endDate: string | null;
  notes: string | null;
  active: boolean;
};

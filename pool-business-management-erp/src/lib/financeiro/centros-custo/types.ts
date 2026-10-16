export type CostCenter = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  parentId: string | null;
  type: string;
  responsibleId: string | null;
  acceptsEntries: boolean;
  startDate: string | null;
  endDate: string | null;
  notes: string | null;
  active: boolean;
};

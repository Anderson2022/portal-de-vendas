export type LookupOption = {
  id: string;
  code: string;
  name: string;
  parentId: string | null;
  active: boolean;
};
export type LookupGroup = {
  options: LookupOption[];
  canCreate: boolean;
  parentKey: string | null;
};
export type ChartLookups = Record<string, LookupGroup>;

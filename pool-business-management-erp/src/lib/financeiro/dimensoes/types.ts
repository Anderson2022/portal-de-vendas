export type DimensionOption = {
  id: string;
  code?: string;
  name: string;
  active?: boolean;
  acceptsEntries?: boolean;
  defaultNatureId?: string | null;
  unitId?: string | number | null;
  type?: string;
  movement?: string;
  status?: string;
};
export type DimensionOptions = {
  centers: DimensionOption[];
  units: DimensionOption[];
  projects: DimensionOption[];
  natures: DimensionOption[];
  accounts: DimensionOption[];
  users: DimensionOption[];
  customers: DimensionOption[];
  banks: DimensionOption[];
  company: DimensionOption;
};
export type RegisterRow = {
  parentId?: string | number | null;
  id: string;
  code: string;
  name: string;
  active: boolean;
};

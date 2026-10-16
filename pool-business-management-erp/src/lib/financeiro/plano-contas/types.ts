import type { FiscalSettings } from "./fiscal-settings";
import type { IntegrationSettings } from "./integration-settings";
import type { AccountNotes } from "./account-notes";
export type ChartAccountRow = {
  id: string;
  code: string;
  shortCode: string;
  name: string;
  active: boolean;
  parentId?: string | null;
  parentName?: string;
  nature?: string;
  accountType?: string;
};
export type ChartAccountUpdate = {
  code: string;
  name: string;
  shortCode: string;
  parentId: string | null;
  groupId: string | null;
  subgroupId: string | null;
  typeId: string | null;
  natureId: string | null;
  active: boolean;
  acceptsEntries: boolean;
  allowsCostCenter: boolean;
  requiresHistory: boolean;
  fiscal: FiscalSettings;
  integrations: IntegrationSettings;
  notes: AccountNotes;
};
export type ChartAccountDetail = ChartAccountRow &
  ChartAccountUpdate & {
    groupName?: string;
    subgroupName?: string;
    hasLinks: boolean;
    updatedAt?: string;
  };

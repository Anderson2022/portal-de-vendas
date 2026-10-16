export type FiscalSettings = {
  referenceAccountId: string | null;
  spedClassificationId: string | null;
  spedCode: string;
  statementId: string | null;
  statementGroupId: string | null;
  closingAccountId: string | null;
  fiscalNatureId: string | null;
  resultTypeId: string | null;
  manualEntries: boolean;
  compensation: boolean;
};

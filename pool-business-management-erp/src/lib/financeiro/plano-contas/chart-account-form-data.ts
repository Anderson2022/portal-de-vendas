import type { ChartAccountUpdate } from "./types";
export function chartAccountFormData(data: FormData): ChartAccountUpdate {
  const text = (key: string) => String(data.get(key) ?? "").trim();
  const id = (key: string) => text(key) || null;
  const flag = (key: string) => data.has(key);
  return {
    code: text("code"),
    name: text("name"),
    shortCode: text("shortCode"),
    parentId: id("parentAccount"),
    groupId: id("accountGroup"),
    subgroupId: id("accountSubgroup"),
    typeId: id("accountType"),
    natureId: id("accountNature"),
    active: flag("active"),
    acceptsEntries: flag("acceptsEntries"),
    allowsCostCenter: flag("allowsCostCenter"),
    requiresHistory: flag("requiresHistory"),
    fiscal: {
      referenceAccountId: id("referenceAccount"),
      spedClassificationId: id("spedClassification"),
      spedCode: text("spedCode"),
      statementId: id("statement"),
      statementGroupId: id("statementGroup"),
      closingAccountId: id("closingAccount"),
      fiscalNatureId: id("fiscalNature"),
      resultTypeId: id("resultType"),
      manualEntries: flag("manualEntries"),
      compensation: flag("compensation"),
    },
    integrations: {
      branchId: id("branch"),
      bankAccountId: id("bankAccount"),
      defaultCostCenterId: id("defaultCostCenter"),
      defaultProjectId: id("defaultProject"),
      externalIntegrationId: id("externalIntegration"),
      externalAccountId: id("externalAccount"),
      externalCode: text("externalCode"),
      autoSync: flag("autoSync"),
    },
    notes: {
      notes: text("notes"),
      entryInstructions: text("entryInstructions"),
      accountingNotes: text("accountingNotes"),
      fiscalNotes: text("fiscalNotes"),
      responsibleUserId: id("responsibleUser"),
      startDate: id("startDate"),
      endDate: id("endDate"),
    },
  };
}

import type { ChartAccountDetail } from "./types";
import type { ChartLookups } from "./lookup-types";
export function initialLookupValues(
  account: ChartAccountDetail | undefined,
  lookups: ChartLookups,
): Record<string, string> {
  const values = {
    parentAccount: account?.parentId,
    accountGroup: account?.groupId,
    accountSubgroup: account?.subgroupId,
    accountType: account?.typeId,
    accountNature: account?.natureId,
    referenceAccount: account?.fiscal?.referenceAccountId,
    spedClassification: account?.fiscal?.spedClassificationId,
    statement: account?.fiscal?.statementId,
    statementGroup: account?.fiscal?.statementGroupId,
    closingAccount: account?.fiscal?.closingAccountId,
    fiscalNature: account?.fiscal?.fiscalNatureId,
    resultType: account?.fiscal?.resultTypeId,
    company: lookups.company?.options[0]?.id,
    branch: account?.integrations?.branchId,
    bankAccount: account?.integrations?.bankAccountId,
    defaultCostCenter: account?.integrations?.defaultCostCenterId,
    defaultProject: account?.integrations?.defaultProjectId,
    externalIntegration: account?.integrations?.externalIntegrationId,
    externalAccount: account?.integrations?.externalAccountId,
    responsibleUser: account?.notes?.responsibleUserId,
  };
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      value == null ? "" : String(value),
    ]),
  );
}

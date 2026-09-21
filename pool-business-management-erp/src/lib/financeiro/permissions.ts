export const financialPermissions = { view: "FINANCIAL_VIEW", create: "FINANCIAL_CREATE" } as const;
export function canFinance(permissions: string[], action: keyof typeof financialPermissions) {
    return permissions.includes(financialPermissions[action]);
}

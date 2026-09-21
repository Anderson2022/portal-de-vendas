// Only routes implemented by FinancialController are registered here.
export const financialEndpoints = {
    summary: "/financial/summary",
    payable: "/financial/payables",
    receivable: "/financial/receivables",
} as const;

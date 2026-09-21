export type FinancialKind = "payable" | "receivable";
export type Decimal = string;
export type FinancialStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
export interface FinancialTitle {
    id: string;
    kind: FinancialKind;
    description: string;
    amount: Decimal;
    dueDate: string;
    status: FinancialStatus;
    paidAt: string | null;
    createdAt: string | null;
    party: string;
    sourceId: string | null;
    sourceType: string | null;
    paymentMethod: string | null;
}
export interface FinancialSummary {
    receivablePending: Decimal;
    receivablePaid: Decimal;
    payablePending: Decimal;
    payablePaid: Decimal;
    cashResult: Decimal;
}
export interface FinancialFilters {
    q: string;
    status: string;
    from: string;
    to: string;
    page: number;
    size: number;
    sort: string;
}
export type SearchValues = Record<string, string | string[] | undefined>;
export interface PageResult<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}
export interface ActionResult {
    ok: boolean;
    message: string;
}
export interface FinancialCapability {
    slug: string;
    label: string;
    description: string;
    fields: string[];
}

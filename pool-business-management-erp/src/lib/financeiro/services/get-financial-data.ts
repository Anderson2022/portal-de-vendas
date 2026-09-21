import "server-only";
import { cache } from "react";
import { api, session, BackendError } from "@/lib/backend/client";
import { financialEndpoints } from "./endpoints";
import { canFinance } from "../permissions";
import type { FinancialKind, FinancialStatus, FinancialSummary, FinancialTitle } from "../types";
interface ApiTitle {
    id: string | number;
    description: string;
    amount: string | number;
    dueDate: string;
    status: FinancialStatus;
    paidAt?: string;
    createdAt?: string;
    supplierId?: string | number;
    customerId?: string | number;
    sourceId?: string | number;
    sourceType?: string;
    paymentMethod?: string;
}
export const getFinancialData = cache(async () => {
    const user = await session();
    if (!canFinance(user.permissions, "view"))
        throw new BackendError("Você não tem permissão para visualizar o Financeiro.", 403);
    const [payables, receivables, summary, suppliers, customers] = await Promise.all([
        api<ApiTitle[]>(financialEndpoints.payable), api<ApiTitle[]>(financialEndpoints.receivable),
        api<FinancialSummary>(financialEndpoints.summary),
        user.permissions.includes("SUPPLIER_VIEW") ? api<Array<{
            id: string | number;
            name: string;
        }>>("/suppliers") : Promise.resolve([]),
        user.permissions.includes("CUSTOMER_VIEW") ? api<Array<{
            id: string | number;
            name: string;
        }>>("/customers") : Promise.resolve([]),
    ]);
    const normalize = (rows: ApiTitle[], kind: FinancialKind): FinancialTitle[] => rows.map(row => ({
        id: String(row.id), kind, description: row.description, amount: String(row.amount),
        dueDate: row.dueDate, status: row.status, paidAt: row.paidAt || null, createdAt: row.createdAt || null,
        party: kind === "payable" ? (row.supplierId ? (suppliers.find(supplier => String(supplier.id) === String(row.supplierId))?.name || `Fornecedor #${row.supplierId}`) : "Sem fornecedor vinculado") : (row.customerId ? (customers.find(customer => String(customer.id) === String(row.customerId))?.name || `Cliente #${row.customerId}`) : "Sem cliente vinculado"),
        sourceId: row.sourceId ? String(row.sourceId) : null, sourceType: row.sourceType || null,
        paymentMethod: row.paymentMethod || null,
    }));
    return { titles: [...normalize(payables, "payable"), ...normalize(receivables, "receivable")], summary, permissions: user.permissions, suppliers: suppliers.map(supplier => ({ id: String(supplier.id), name: supplier.name })) };
});

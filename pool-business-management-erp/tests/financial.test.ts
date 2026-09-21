import test from "node:test";
import assert from "node:assert/strict";
import { cents, decimal, total, currency, parseMoneyInput } from "../src/lib/financeiro/money";
import { filterTitles, paginateTitles, readFilters, titleStatus } from "../src/lib/financeiro/filter-titles";
import { cashFlowRows } from "../src/lib/financeiro/cash-flow";
import { canFinance } from "../src/lib/financeiro/permissions";
import { validDate } from "../src/lib/financeiro/dates";
import type { FinancialTitle } from "../src/lib/financeiro/types";
function title(overrides: Partial<FinancialTitle> = {}): FinancialTitle {
    return { id: "1", kind: "receivable", description: "Parcela de venda", amount: "0.10", dueDate: "2026-09-20", status: "PENDING", paidAt: null, createdAt: null, party: "Cliente #1", sourceId: "1", sourceType: "SALE", paymentMethod: "PIX", ...overrides };
}
test("valores decimais preservam centavos, limites e totais sem float", () => {
    assert.equal(total(["0.10", "0.20"]), "0.30");
    assert.equal(total(["999999999999.99", "0.01"]), "1000000000000.00");
    assert.equal(decimal(cents("-10.01")), "-10.01");
    assert.equal(currency("1234.56"), "R$ 1.234,56");
    assert.equal(parseMoneyInput("1.234,56"), "1234.56");
    assert.equal(parseMoneyInput("0,01"), "0.01");
    for (const value of ["0", "-1", "1.23", "1,234", "NaN", "1e3", "1000000000000"])
        assert.throws(() => parseMoneyInput(value));
});
test("vencimento não transforma títulos pagos ou cancelados em atrasados", () => {
    assert.equal(titleStatus(title(), "2026-09-21"), "OVERDUE");
    assert.equal(titleStatus(title(), "2026-09-20"), "PENDING");
    assert.equal(titleStatus(title({ status: "PAID" }), "2026-09-21"), "PAID");
    assert.equal(titleStatus(title({ status: "CANCELLED" }), "2026-09-21"), "CANCELLED");
});
test("filtros e paginação limitam a página e mantêm total do conjunto filtrado", () => {
    const rows = Array.from({ length: 25 }, (_, index) => title({ id: String(index + 1), amount: "0.10" }));
    const filters = readFilters({ size: "20", page: "999", sort: "-amount", from: "2026-02-30" });
    assert.equal(filters.from, "");
    const result = paginateTitles(filterTitles(rows, filters), filters);
    assert.equal(result.page, 1);
    assert.equal(result.content.length, 5);
    assert.equal(result.total, "2.50");
    assert.equal(filterTitles(rows, { ...filters, q: "inexistente" }).length, 0);
});
test("fluxo considera somente eventos do regime selecionado e fuso da empresa", () => {
    const rows = [title({ status: "PAID", paidAt: "2026-09-21T01:00:00Z" }), title({ id: "2", kind: "payable", amount: "0.03", status: "PAID", paidAt: "2026-09-21T01:00:00Z" }), title({ id: "3", amount: "2.00" }), title({ id: "4", status: "CANCELLED", amount: "500" })];
    const flow = cashFlowRows(rows, "realizado");
    assert.equal(flow.length, 1);
    assert.equal(flow[0].date, "2026-09-20");
    assert.equal(flow[0].net, "0.07");
    assert.equal(cashFlowRows(rows, "previsto")[0].incoming, "2.00");
    const paidFilters = readFilters({ from: "2026-09-20", to: "2026-09-20", status: "PAID" });
    assert.equal(filterTitles(rows, paidFilters, true).length, 2);
});
test("datas e permissões rejeitam entradas não autorizadas", () => {
    assert.equal(validDate("2026-02-30"), false);
    assert.equal(validDate("2028-02-29"), true);
    assert.equal(canFinance(["FINANCIAL_VIEW"], "create"), false);
    assert.equal(canFinance(["FINANCIAL_CREATE"], "create"), true);
    assert.equal(canFinance([], "view"), false);
});

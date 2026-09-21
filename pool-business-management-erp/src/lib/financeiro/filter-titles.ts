import { cents, total } from "./money";
import { today, validDate, localDate } from "./dates";
import type { FinancialFilters, FinancialTitle, PageResult, SearchValues } from "./types";
export function titleStatus(title: FinancialTitle, date = today()) {
    return title.status === "PENDING" && title.dueDate < date ? "OVERDUE" : title.status;
}
export function readFilters(values: SearchValues): FinancialFilters {
    const str = (key: string) => typeof values[key] === "string" ? values[key] as string : "";
    return {
        q: str("q").slice(0, 150), status: str("status"),
        from: validDate(str("from")) ? str("from") : "", to: validDate(str("to")) ? str("to") : "",
        page: Math.max(0, Math.min(100000, Math.floor(Number(str("page")) || 0))),
        size: [20, 50, 100].includes(Number(str("size"))) ? Number(str("size")) : 20,
        sort: ["dueDate", "-dueDate", "amount", "-amount", "description"].includes(str("sort")) ? str("sort") : "dueDate"
    };
}
export function filterTitles(titles: FinancialTitle[], filters: FinancialFilters, paidDate = false) {
    const date = today();
    return titles.filter(title => {
        const at = paidDate ? (title.paidAt ? localDate(title.paidAt) : "") : title.dueDate;
        return (!filters.q || `${title.id} ${title.description} ${title.party}`.toLocaleLowerCase("pt-BR").includes(filters.q.toLocaleLowerCase("pt-BR"))) &&
            (!filters.status || titleStatus(title, date) === filters.status) &&
            (!filters.from || at >= filters.from) && (!filters.to || at <= filters.to);
    }).sort((a, b) => {
        const direction = filters.sort.startsWith("-") ? -1 : 1;
        const key = filters.sort.replace("-", "");
        const result = key === "amount" ? (cents(a.amount) < cents(b.amount) ? -1 : cents(a.amount) > cents(b.amount) ? 1 : 0) :
            (key === "description" ? a.description.localeCompare(b.description, "pt-BR") : a.dueDate.localeCompare(b.dueDate));
        return result * direction || a.id.localeCompare(b.id);
    });
}
// The current API returns lists. Filtering/paging runs in the Next.js server;
// only a page is serialized to the browser. Replace with API paging when supported.
export function paginateTitles(rows: FinancialTitle[], filters: FinancialFilters): PageResult<FinancialTitle> & {
    total: string;
} {
    const totalPages = Math.ceil(rows.length / filters.size);
    const page = Math.min(filters.page, Math.max(0, totalPages - 1));
    return {
        content: rows.slice(page * filters.size, (page + 1) * filters.size), page, size: filters.size,
        totalElements: rows.length, totalPages, total: total(rows.map(row => row.amount))
    };
}

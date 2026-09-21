import { cents, decimal } from "./money";
import { localDate, today } from "./dates";
import type { FinancialTitle } from "./types";
export interface FlowRow {
    date: string;
    incoming: string;
    outgoing: string;
    net: string;
    accumulated: string;
}
export function cashFlowRows(titles: FinancialTitle[], mode: "realizado" | "previsto", from = "", to = ""): FlowRow[] {
    const groups = new Map<string, {
        incoming: bigint;
        outgoing: bigint;
    }>();
    for (const title of titles) {
        const include = mode === "realizado" ? title.status === "PAID" && !!title.paidAt : ["PENDING", "OVERDUE"].includes(title.status);
        if (!include)
            continue;
        const date = mode === "realizado" ? localDate(title.paidAt!) : title.dueDate;
        if ((from && date < from) || (to && date > to))
            continue;
        const row = groups.get(date) || { incoming: BigInt("0"), outgoing: BigInt("0") };
        row[title.kind === "receivable" ? "incoming" : "outgoing"] += cents(title.amount);
        groups.set(date, row);
    }
    let accumulated = BigInt("0");
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, value]) => {
        const net = value.incoming - value.outgoing;
        accumulated += net;
        return { date, incoming: decimal(value.incoming), outgoing: decimal(value.outgoing), net: decimal(net), accumulated: decimal(accumulated) };
    });
}
export function delinquency(titles: FinancialTitle[]) {
    const date = today();
    const ranges = [7, 15, 30, 60, 90, Infinity];
    const labels = ["1–7 dias", "8–15 dias", "16–30 dias", "31–60 dias", "61–90 dias", "+90 dias"];
    const groups = ranges.map((_, index) => ({ label: labels[index], count: 0, amount: BigInt("0") }));
    for (const title of titles) {
        if (title.kind !== "receivable" || !["PENDING", "OVERDUE"].includes(title.status) || title.dueDate >= date)
            continue;
        const days = Math.floor((Date.parse(date) - Date.parse(title.dueDate)) / 86400000);
        const group = groups[ranges.findIndex(limit => days <= limit)];
        group.count++;
        group.amount += cents(title.amount);
    }
    return groups.map(group => ({ ...group, amount: decimal(group.amount) }));
}

import type { Decimal } from "./types";
// Decimal arithmetic stays in integer cents, including totals and differences.
export function cents(value: string | number): bigint {
    const text = String(value);
    if (!/^-?\d+(?:\.\d{1,2})?$/.test(text))
        throw new Error("Valor monetário inválido.");
    const negative = text.startsWith("-");
    const [whole, fraction = ""] = text.replace(/^-/, "").split(".");
    const amount = BigInt(whole) * BigInt("100") + BigInt(fraction.padEnd(2, "0"));
    return negative ? -amount : amount;
}
export function decimal(value: bigint): Decimal {
    const absolute = value < BigInt("0") ? -value : value;
    return `${value < BigInt("0") ? "-" : ""}${absolute / BigInt("100")}.${String(absolute % BigInt("100")).padStart(2, "0")}`;
}
export function total(values: Array<string | number>): Decimal {
    return decimal(values.reduce<bigint>((sum, value) => sum + cents(value), BigInt("0")));
}
export function currency(value: string | number): string {
    const amount = cents(value), absolute = amount < BigInt("0") ? -amount : amount;
    return `${amount < BigInt("0") ? "−" : ""}R$ ${(absolute / BigInt("100")).toLocaleString("pt-BR")},${String(absolute % BigInt("100")).padStart(2, "0")}`;
}
export function parseMoneyInput(value: string): Decimal {
    const normalized = value.trim().replace(/\s|R\$/g, "");
    if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(normalized))
        throw new Error("Informe um valor como 1.234,56.");
    const result = cents(normalized.replace(/\./g, "").replace(",", "."));
    if (result <= BigInt("0") || result > BigInt("99999999999999"))
        throw new Error("Valor deve estar entre R$ 0,01 e R$ 999.999.999.999,99.");
    return decimal(result);
}

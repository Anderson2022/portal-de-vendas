import type { InstallmentPreview } from "./payable-form-types";

export function currency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}

export function moneyValue(value: string) {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

export function addDays(value: string, days: number) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function buildInstallments(
  total: number,
  count: number,
  firstDueDate: string,
  intervalDays: number,
): InstallmentPreview[] {
  if (!firstDueDate || count < 1) return [];
  const cents = Math.round(total * 100);
  const base = Math.floor(cents / count);
  const remainder = cents - base * count;

  return Array.from({ length: count }, (_, index) => ({
    number: index + 1,
    dueDate: addDays(firstDueDate, intervalDays * index),
    amount: (base + (index < remainder ? 1 : 0)) / 100,
  }));
}

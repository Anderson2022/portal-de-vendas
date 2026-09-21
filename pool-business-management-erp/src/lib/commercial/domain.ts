export type EditorItem = {
  key: string;
  productId?: string | null;
  description: string;
  qty: string;
  unitPrice: string;
  unitCost: string;
};
export type DocumentInput = {
  customerId: string;
  salespersonId: string | null;
  project: string;
  validUntil: string;
  notes: string;
  discount: string;
  items: EditorItem[];
  paymentMethod?: string;
  paid?: boolean;
  dueDate?: string;
};
export type FormOptions = {
  customers: { id: string; name: string }[];
  sellers: { id: string; name: string }[];
  products: { id: string; name: string; salePrice: string; avgCost: string }[];
};
export const paymentMethods = {
  PIX: "Pix",
  DINHEIRO: "Dinheiro",
  CARTAO: "Cartão",
  BOLETO: "Boleto",
};
export const todayISO = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "America/Cuiaba" });
export function cents(value: string | number): number {
  const normalized =
    typeof value === "string"
      ? value.includes(",")
        ? value.trim().replace(/\./g, "").replace(",", ".")
        : value.trim()
      : value;
  if (normalized === "" || !Number.isFinite(Number(normalized)))
    throw new Error("Informe um valor monetário válido.");
  return Math.round(Number(normalized) * 100);
}
export function totals(items: EditorItem[], discount: string) {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.qty || 0) * cents(item.unitPrice || "0"),
    0,
  );
  return {
    subtotal,
    discount: cents(discount || "0"),
    total: subtotal - cents(discount || "0"),
  };
}
export function validateDocument(input: DocumentInput) {
  if (!input.customerId || !/^[0-9a-f-]{36}$/i.test(input.customerId))
    throw new Error("Selecione um cliente.");
  if (!input.project?.trim() || input.project.trim().length > 180)
    throw new Error("Informe o projeto com até 180 caracteres.");
  if (
    !Array.isArray(input.items) ||
    !input.items.length ||
    input.items.length > 100
  )
    throw new Error("Adicione de 1 a 100 itens.");
  for (const item of input.items) {
    if (!item.description?.trim() || item.description.trim().length > 180)
      throw new Error(
        "Preencha a descrição de todos os itens (até 180 caracteres).",
      );
    if (
      !Number.isInteger(Number(item.qty)) ||
      Number(item.qty) < 1 ||
      Number(item.qty) > 100000
    )
      throw new Error("A quantidade deve ser um número inteiro positivo.");
    if (cents(item.unitPrice) < 0 || cents(item.unitCost) < 0)
      throw new Error("Preços e custos não podem ser negativos.");
  }
  const result = totals(input.items, input.discount);
  if (
    result.discount < 0 ||
    result.total <= 0 ||
    result.subtotal > 999999999999
  )
    throw new Error(
      "O total deve ser positivo e o desconto menor que o subtotal.",
    );
  for (const date of [input.validUntil, input.dueDate]) {
    if (
      date &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        Number.isNaN(Date.parse(date)) ||
        new Date(date).toISOString().slice(0, 10) !== date)
    )
      throw new Error("Informe uma data válida.");
  }
  if ((input.notes || "").length > 5000)
    throw new Error("As observações devem ter até 5.000 caracteres.");
  return result;
}

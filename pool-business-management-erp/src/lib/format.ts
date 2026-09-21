export const n = (v: unknown): number => Number(v ?? 0);
export const documentCode = (id: string | number) => String(id).includes("-") ? String(id).slice(0,8).toUpperCase() : String(id);

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const brlCompact = (v: number) => {
  if (Math.abs(v) >= 1_000_000)
    return `R$ ${(v / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mi`;
  if (Math.abs(v) >= 1000)
    return `R$ ${(v / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil`;
  return brl(v);
};

export const pct = (v: number, digits = 1) =>
  `${v.toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits })}%`;

/** '2026-05-12' -> '12/05/2026' */
export const dateBR = (d?: string | null) => {
  if (!d) return "—";
  const [y, m, dd] = d.split("-");
  return `${dd}/${m}/${y}`;
};

/** '2026-05-12' -> '12/05' */
export const dateShort = (d?: string | null) => {
  if (!d) return "—";
  const [, m, dd] = d.split("-");
  return `${dd}/${m}`;
};

export const monthLabel = (ym: string) => {
  const names = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const [y, m] = ym.split("-").map(Number);
  return `${names[m - 1]}/${String(y).slice(2)}`;
};

export const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

export type Tone = "blue" | "green" | "amber" | "red" | "slate" | "orange" | "violet";

export const quoteStatusMap: Record<string, { label: string; tone: Tone }> = {
  LEAD: { label: "Lead", tone: "slate" },
  ORCAMENTO: { label: "Orçamento", tone: "blue" },
  NEGOCIACAO: { label: "Negociação", tone: "amber" },
  FECHADO: { label: "Fechado", tone: "green" },
  CANCELADO: { label: "Cancelado", tone: "red" },
};

export const saleStatusMap: Record<string, { label: string; tone: Tone }> = {
  NEGOCIACAO: { label: "Em negociação", tone: "amber" },
  FECHADA: { label: "Venda fechada", tone: "green" },
  ENTREGUE: { label: "Entregue", tone: "blue" },
  CANCELADA: { label: "Cancelada", tone: "red" },
};

export const woStatusMap: Record<string, { label: string; tone: Tone }> = {
  PENDENTE: { label: "Pendente", tone: "slate" },
  AGENDADA: { label: "Agendada", tone: "blue" },
  DESLOCAMENTO: { label: "Em deslocamento", tone: "violet" },
  EXECUCAO: { label: "Em execução", tone: "orange" },
  PAUSADA: { label: "Pausada", tone: "amber" },
  CONCLUIDA: { label: "Concluída", tone: "green" },
  CANCELADA: { label: "Cancelada", tone: "red" },
};

export const woFlow = ["AGENDADA", "EXECUCAO", "CONCLUIDA"];

export const finStatusMap: Record<string, { label: string; tone: Tone }> = {
  RECEBIDO: { label: "Recebido", tone: "green" },
  PAGO: { label: "Pago", tone: "green" },
  PENDENTE: { label: "Pendente", tone: "blue" },
  VENCIDO: { label: "Vencido", tone: "red" },
};

export const roleMap: Record<string, { label: string; tone: Tone }> = {
  ADMIN: { label: "Administrador", tone: "violet" },
  GERENTE: { label: "Gerente", tone: "blue" },
  VENDEDOR: { label: "Vendedor", tone: "green" },
  FINANCEIRO: { label: "Financeiro", tone: "amber" },
  ESTOQUISTA: { label: "Estoquista", tone: "slate" },
  TECNICO: { label: "Técnico", tone: "orange" },
  CAIXA: { label: "Caixa", tone: "slate" },
};

/** Âncoras temporais da operação de demonstração */
export const TODAY = new Date().toLocaleDateString("en-CA", {timeZone:"America/Cuiaba"});
export const MONTH = TODAY.slice(0,7);
export const PREVIOUS_MONTH = new Date(Date.UTC(Number(MONTH.slice(0,4)),Number(MONTH.slice(5,7))-2,1)).toISOString().slice(0,7);
export const PERIOD_LABEL = new Date(MONTH+"-15T12:00:00Z").toLocaleDateString("pt-BR",{month:"long",year:"numeric"});

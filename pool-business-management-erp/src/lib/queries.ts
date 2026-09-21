import { backendData } from "./backend/data";
import { MONTH, PREVIOUS_MONTH, n } from "./format";

export const MONTHS_SERIES = Array.from({ length: 12 }, (_, i) => { const d = new Date(MONTH + '-01T12:00:00Z'); d.setUTCMonth(d.getUTCMonth() - 11 + i); return d.toISOString().slice(0, 7); });
const base = backendData;
const custName = (cust: { id: string; name: string }[], id: string | null) =>
  cust.find((c) => c.id === id)?.name ?? "—";
const sellName = (sell: { id: string; name: string }[], id: string | null) =>
  sell.find((s) => s.id === id)?.name ?? "—";

/* ─────────────────────────── Vendas: visão geral ─────────────────────────── */

export async function vendasOverview() {
  const { cust, sell, sal, quo, comms } = await base();
  const monthSales = sal.filter((s) => s.saleDate.startsWith(MONTH) && s.status !== "CANCELADA");
  const revenue = monthSales.reduce((a, s) => a + n(s.totalValue), 0);
  const profit = monthSales.reduce((a, s) => a + n(s.profit), 0);
  const commissionsMonth = comms
    .filter((c) => c.month === MONTH)
    .reduce((a, c) => a + n(c.amount), 0);

  const openQuotes = quo.filter((q) => q.status === "ORCAMENTO");
  const funnel = (status: string) => {
    const list = quo.filter((q) => q.status === status);
    return { count: list.length, value: list.reduce((a, q) => a + n(q.total), 0) };
  };

  const prevSales = sal.filter((s) => s.saleDate.startsWith(PREVIOUS_MONTH) && s.status !== "CANCELADA");
  const prevRevenue = prevSales.reduce((a, s) => a + n(s.totalValue), 0);
  const prevProfit = prevSales.reduce((a, s) => a + n(s.profit), 0);
  const prevComm = comms
    .filter((c) => c.month === PREVIOUS_MONTH)
    .reduce((a, c) => a + n(c.amount), 0);

  const recentQuotes = [...quo]
    .sort((a, b) => b.number.localeCompare(a.number))
    .slice(0, 5)
    .map((q) => ({ ...q, customer: custName(cust, q.customerId) }));

  const bySeller = new Map<string, { total: number; count: number }>();
  for (const s of monthSales) {
    if (!s.salespersonId) continue;
    const cur = bySeller.get(s.salespersonId) ?? { total: 0, count: 0 };
    cur.total += n(s.totalValue);
    cur.count += 1;
    bySeller.set(s.salespersonId, cur);
  }
  const ranking = [...bySeller.entries()]
    .map(([id, v]) => ({ id, name: sellName(sell, id), ...v }))
    .sort((a, b) => b.total - a.total);

  return {
    revenue,
    profit,
    marginAvg: revenue > 0 ? (profit / revenue) * 100 : 0,
    commissionsMonth,
    openQuotesCount: openQuotes.length,
    openQuotesValue: openQuotes.reduce((a, q) => a + n(q.total), 0),
    funnel: {
      lead: funnel("LEAD"),
      orcamento: funnel("ORCAMENTO"),
      negociacao: funnel("NEGOCIACAO"),
      fechado: { count: monthSales.length, value: revenue },
    },
    recentQuotes,
    ranking,
    salesCount: monthSales.length,
    ticketAvg: monthSales.length ? revenue / monthSales.length : 0,
    revenueDelta: prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0,
    marginDelta:
      prevRevenue > 0 && revenue > 0
        ? (profit / revenue) * 100 - (prevProfit / prevRevenue) * 100
        : 0,
    commDelta: prevComm > 0 ? ((commissionsMonth - prevComm) / prevComm) * 100 : 0,
  };
}

/* ─────────────────────────── Venda em destaque / detalhe ─────────────────────────── */

export async function saleDetail(number: string) {
  const { cust, sell, sal, its, costs, recv } = await base();
  const sale = sal.find((s) => s.number === number);
  if (!sale) return null;
  const items = its.filter((i) => i.saleId === sale.id);
  const costLines = costs.filter((c) => c.saleId === sale.id);
  const payments = recv.filter((r) => r.saleId === sale.id);
  return {
    sale,
    items,
    costLines,
    payments,
    customer: custName(cust, sale.customerId),
    seller: sellName(sell, sale.salespersonId),
  };
}

export async function featuredSale() {
  const { sal } = await base();
  return sal.length ? saleDetail(sal[0].id) : null;
}

/* ─────────────────────────── Orçamentos / pedidos ─────────────────────────── */

export async function quotesList() {
  const { cust, sell, quo } = await base();
  return [...quo]
    .sort((a, b) => b.number.localeCompare(a.number))
    .map((q) => ({
      ...q,
      customer: custName(cust, q.customerId),
      seller: sellName(sell, q.salespersonId),
    }));
}

export async function salesList() {
  const { cust, sell, sal } = await base();
  return [...sal]
    .sort((a, b) => b.number.localeCompare(a.number))
    .map((s) => ({
      ...s,
      customer: custName(cust, s.customerId),
      seller: sellName(sell, s.salespersonId),
    }));
}

export async function marginsList() {
  const list = await salesList();
  const month = list.filter((s) => s.saleDate.startsWith(MONTH) && s.status !== "CANCELADA");
  return {
    month,
    totals: {
      revenue: month.reduce((a, s) => a + n(s.totalValue), 0),
      cost: month.reduce((a, s) => a + n(s.totalCost), 0),
      profit: month.reduce((a, s) => a + n(s.profit), 0),
    },
  };
}

export async function commissionsList() {
  const { sell, sal, comms } = await base();
  const rows = comms
    .filter((c) => c.month === MONTH)
    .map((c) => ({
      ...c,
      seller: sellName(sell, c.salespersonId),
      saleNumber: sal.find((s) => s.id === c.saleId)?.number ?? "",
      saleTotal: n(sal.find((s) => s.id === c.saleId)?.totalValue),
    }))
    .sort((a, b) => String(b.saleNumber).localeCompare(String(a.saleNumber)));
  const bySeller = new Map<string, { amount: number; count: number }>();
  for (const r of rows) {
    const cur = bySeller.get(r.seller) ?? { amount: 0, count: 0 };
    cur.amount += n(r.amount);
    cur.count += 1;
    bySeller.set(r.seller, cur);
  }
  return {
    rows,
    total: rows.reduce((a, r) => a + n(r.amount), 0),
    bySeller: [...bySeller.entries()].map(([name, v]) => ({ name, ...v })),
  };
}

/* ─────────────────────────── Clientes / vendedores ─────────────────────────── */

export async function customersList() {
  const { cust, sal } = await base();
  return cust
    .map((c) => {
      const my = sal.filter((s) => s.customerId === c.id && s.status !== "CANCELADA");
      return {
        ...c,
        totalBought: my.reduce((a, s) => a + n(s.totalValue), 0),
        purchases: my.length,
        lastPurchase: my.map((s) => s.saleDate).sort().at(-1) ?? null,
      };
    })
    .sort((a, b) => b.totalBought - a.totalBought);
}

export async function sellersList() {
  const { sell, sal, comms } = await base();
  const monthSales = sal.filter((s) => s.saleDate.startsWith(MONTH) && s.status !== "CANCELADA");
  return sell
    .map((sp) => {
      const my = monthSales.filter((s) => s.salespersonId === sp.id);
      const sold = my.reduce((a, s) => a + n(s.totalValue), 0);
      const comm = comms
        .filter((c) => c.salespersonId === sp.id && c.month === MONTH)
        .reduce((a, c) => a + n(c.amount), 0);
      return {
        ...sp,
        sold,
        count: my.length,
        commission: comm,
        goalPct: n(sp.monthlyGoal) > 0 ? (sold / n(sp.monthlyGoal)) * 100 : 0,
      };
    })
    .sort((a, b) => b.sold - a.sold);
}

/* ─────────────────────────── Estoque ─────────────────────────── */

export async function stockData() {
  const { prods, cats, movs } = await base();
  const rows = prods.map((p) => {
    const available = p.stock - p.reserved;
    const status =
      available <= 0 ? "RUPTURA"
        : available < p.minStock ? "CRITICO"
          : available < p.minStock * 1.4 ? "BAIXO" : "OK";
    return {
      ...p,
      available,
      status,
      category: cats.find((c) => c.id === p.categoryId)?.name ?? "—",
      stockValue: p.stock * n(p.avgCost),
    };
  });
  return {
    rows: rows.sort((a, b) => a.available - a.minStock - (b.available - b.minStock)),
    critical: rows.filter((r) => r.status === "CRITICO").length,
    low: rows.filter((r) => r.status === "BAIXO").length,
    rupture: rows.filter((r) => r.status === "RUPTURA").length,
    totalValue: rows.reduce((a, r) => a + r.stockValue, 0),
    totalUnits: rows.reduce((a, r) => a + r.stock, 0),
    movements: [...movs]
      .sort((a, b) => (b.createdAt + String(b.id)).localeCompare(a.createdAt + String(a.id)))
      .slice(0, 14)
      .map((mv) => ({ ...mv, product: prods.find((p) => p.id === mv.productId)?.name ?? "—" })),
  };
}

/* ─────────────────────────── Financeiro ─────────────────────────── */

export async function financialData() {
  const { cust, recv, pay } = await base();
  const enrich = <T extends { customerId: string | null }>(r: T) => ({
    ...r,
    customer: custName(cust, r.customerId),
  });
  const recSorted = [...recv]
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .map(enrich);
  const paySorted = [...pay].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const sumR = (f: (r: (typeof recv)[0]) => boolean) =>
    recv.filter(f).reduce((a, r) => a + n(r.amount), 0);
  const sumP = (f: (p: (typeof pay)[0]) => boolean) =>
    pay.filter(f).reduce((a, p) => a + n(p.amount), 0);

  return {
    receivables: recSorted,
    payables: paySorted,
    toReceive: sumR((r) => r.status !== "RECEBIDO"),
    receivedMonth: sumR((r) => r.status === "RECEBIDO" && (r.paidAt ?? "").startsWith(MONTH)),
    overdueReceive: sumR((r) => r.status === "VENCIDO"),
    overdueReceiveCount: recv.filter((r) => r.status === "VENCIDO").length,
    toPay: sumP((p) => p.status !== "PAGO"),
    paidMonth: sumP((p) => p.status === "PAGO" && (p.paidAt ?? "").startsWith(MONTH)),
  };
}

/* ─────────────────────────── Ordens de serviço / piscinas / usuários ─────────────────────────── */

export async function workOrdersList() {
  const { cust, wos } = await base();
  return [...wos]
    .sort((a, b) => b.number.localeCompare(a.number))
    .map((w) => ({ ...w, customer: custName(cust, w.customerId) }));
}

export async function poolsList() {
  return (await base()).pools;
}

export async function usersList() {
  return (await base()).users;
}

export async function suppliersList() {
  return (await base()).suppliers;
}

/* ─────────────────────────── Relatórios (dono da empresa) ─────────────────────────── */

export async function reportsData() {
  const { cust, sell, sal, its, pay, comms, prods } = await base();
  const active = sal.filter((s) => s.status !== "CANCELADA");
  const series = MONTHS_SERIES.map((m) => {
    const mine = active.filter((s) => s.saleDate.startsWith(m));
    const revenue = mine.reduce((a, s) => a + n(s.totalValue), 0);
    const cost = mine.reduce((a, s) => a + n(s.totalCost), 0);
    return { m, revenue, cost, profit: revenue - cost, count: mine.length };
  });

  const month = series.find((s) => s.m === MONTH)!;
  const opExpenses = pay
    .filter((p) => p.category !== "Mercadorias")
    .reduce((a, p) => a + n(p.amount), 0);
  const commissionsMonth = comms
    .filter((c) => c.month === MONTH)
    .reduce((a, c) => a + n(c.amount), 0);

  // Vendas por vendedor (mês)
  const monthSales = active.filter((s) => s.saleDate.startsWith(MONTH));
  const bySeller = new Map<string, { total: number; count: number }>();
  for (const s of monthSales) {
    if (!s.salespersonId) continue;
    const cur = bySeller.get(s.salespersonId) ?? { total: 0, count: 0 };
    cur.total += n(s.totalValue);
    cur.count += 1;
    bySeller.set(s.salespersonId, cur);
  }
  const sellerTotals = [...bySeller.entries()]
    .map(([id, v]) => ({ name: sellName(sell, id), ...v }))
    .sort((a, b) => b.total - a.total);

  // Produtos mais vendidos (por receita de itens, mês)
  const monthSaleIds = new Set(monthSales.map((s) => s.id));
  const byProduct = new Map<string, number>();
  for (const i of its) {
    if (!monthSaleIds.has(i.saleId)) continue;
    byProduct.set(i.description, (byProduct.get(i.description) ?? 0) + n(i.unitPrice) * i.qty);
  }
  const topProducts = [...byProduct.entries()]
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  // Clientes que mais compram (geral)
  const byCustomer = new Map<string, number>();
  for (const s of active)
    byCustomer.set(s.customerId, (byCustomer.get(s.customerId) ?? 0) + n(s.totalValue));
  const topCustomers = [...byCustomer.entries()]
    .map(([id, total]) => ({ name: custName(cust, id), total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const critical = prods
    .map((p) => ({ ...p, available: p.stock - p.reserved }))
    .filter((p) => p.available < p.minStock)
    .sort((a, b) => a.available - a.minStock - (b.available - b.minStock));

  const overdue = (await financialData()).receivables.filter((r) => r.status === "VENCIDO");

  return {
    month,
    series,
    opExpenses,
    netProfit: month.profit - opExpenses,
    commissionsMonth,
    sellerTotals,
    topProducts,
    topCustomers,
    critical,
    overdue,
    salesCount: monthSales.length,
    ticketAvg: monthSales.length ? month.revenue / monthSales.length : 0,
    marginAvg: month.revenue > 0 ? (month.profit / month.revenue) * 100 : 0,
  };
}

/* ─────────────────────────── Busca global ─────────────────────────── */

export async function searchAll(q: string) {
  const query = q.trim().toLowerCase();
  if (query.length < 2) return { customers: [], products: [], quotes: [], sales: [], workOrders: [] };
  const { cust, sal, quo, prods, wos } = await base();
  const has = (s?: string | null) => (s ?? "").toLowerCase().includes(query);
  const numQ = query;
  const custMap = new Map(cust.map((c) => [c.id, c.name]));
  return {
    customers: cust.filter((c) => has(c.name) || has(c.email) || has(c.phone)).slice(0, 4),
    products: prods.filter((p) => has(p.name) || has(p.sku)).slice(0, 4),
    quotes: quo
      .filter((x) => has(x.project) || has(custMap.get(x.customerId)) || (numQ && x.number.toLowerCase().includes(numQ)))
      .slice(0, 4)
      .map((x) => ({ ...x, customer: custMap.get(x.customerId) })),
    sales: sal
      .filter((x) => has(custMap.get(x.customerId)) || (numQ && x.number.toLowerCase().includes(numQ)))
      .slice(0, 4)
      .map((x) => ({ ...x, customer: custMap.get(x.customerId) })),
    workOrders: wos
      .filter((x) => has(x.poolModel) || has(custMap.get(x.customerId)) || (numQ && x.number.toLowerCase().includes(numQ)))
      .slice(0, 4)
      .map((x) => ({ ...x, customer: custMap.get(x.customerId) })),
  };
}

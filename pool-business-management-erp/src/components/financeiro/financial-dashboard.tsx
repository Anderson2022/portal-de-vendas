"use client";

import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BellRing,
  CalendarDays,
  CircleDollarSign,
  Database,
  Lightbulb,
  Plus,
  Users,
  WalletCards,
} from "lucide-react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cashFlow, payables, receivables } from "@/lib/financeiro/financeiro-data";
import { money } from "@/lib/financeiro/utils";
import { KpiCard } from "./kpi-card";
import { TransactionsTable } from "./transactions-table";

const pieData = [
  { name: "Receitas", value: 52680, color: "#10b981" },
  { name: "Despesas", value: 34840, color: "#f43f5e" },
];

function FilterButton({ icon: Icon, label }: { icon: typeof CalendarDays; label: string }) {
  return (
    <button className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 shadow-sm">
      <Icon className="h-4 w-4 text-slate-400" />
      <span>{label}</span>
      <span className="ml-1 text-slate-400">⌄</span>
    </button>
  );
}

export function FinancialDashboard() {
  return (
    <div className="mx-auto w-full max-w-[1760px] p-4 lg:p-6 xl:p-7">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-2 text-xs text-slate-400">Início <span className="px-1">›</span> Financeiro</div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 xl:text-[38px]">Financeiro</h1>
          <p className="mt-1 text-sm text-slate-500">Controle completo das suas finanças. Acompanhe entradas, saídas e o resultado do seu negócio.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterButton icon={CalendarDays} label="Maio de 2024" />
          <FilterButton icon={Database} label="Todas as contas" />
          <FilterButton icon={Users} label="Todos os centros de custo" />
          <button className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Novo lançamento
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        <KpiCard title="Saldo disponível" value="R$ 125.430,20" helper="↑ +12,5% em relação a abril" helperClassName="font-medium text-emerald-600" icon={WalletCards} iconClassName="bg-emerald-50 text-emerald-600" />
        <KpiCard title="A receber" value="R$ 48.230,00" helper="R$ 6.320,00 vencidos (3)" helperClassName="font-medium text-rose-500" icon={ArrowUpRight} iconClassName="bg-sky-50 text-sky-500" />
        <KpiCard title="A pagar" value="R$ 32.100,00" helper="R$ 4.890,00 vencidos (2)" helperClassName="font-medium text-rose-500" icon={ArrowDownRight} iconClassName="bg-rose-50 text-rose-500" />
        <KpiCard title="Resultado do mês" value="R$ 16.130,00" helper="↑ +28,4% em relação a abril" helperClassName="font-medium text-emerald-600" icon={BarChart3} iconClassName="bg-violet-50 text-violet-500" />
      </div>

      <div className="mt-4 grid gap-4 2xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,.75fr)_minmax(300px,.7fr)]">
        <section className="rounded-[22px] border border-white/80 bg-white p-4 shadow-soft xl:p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-500"><BarChart3 className="h-4 w-4" /></div>
                <h2 className="font-semibold">Fluxo de caixa</h2>
              </div>
              <p className="ml-10 mt-1 text-xs text-slate-400">Entradas e saídas no período selecionado.</p>
            </div>
            <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">Maio de 2024 ⌄</button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cashFlow} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#edf1f5" vertical={false} />
                <XAxis dataKey="dia" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `R$ ${v / 1000}k`} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={55} />
                <Tooltip formatter={(value) => money(Number(value ?? 0))} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="entradas" name="Entradas" fill="#10b981" radius={[4,4,0,0]} barSize={16} />
                <Bar dataKey="saidas" name="Saídas" fill="#fb7185" radius={[4,4,0,0]} barSize={16} />
                <Line type="monotone" dataKey="saldo" name="Saldo" stroke="#2583f7" strokeWidth={2.5} dot={{ r: 3, fill: "#2583f7" }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-[22px] border border-white/80 bg-white p-4 shadow-soft xl:p-5">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2"><CircleDollarSign className="h-5 w-5 text-emerald-500" /><h2 className="font-semibold">Receitas x despesas</h2></div>
              <p className="mt-1 text-xs text-slate-400">Composição do período</p>
            </div>
            <div className="rounded-lg bg-slate-100 p-1 text-[10px]"><span className="rounded-md bg-white px-2 py-1 shadow-sm">Mês</span><span className="px-2 py-1 text-slate-400">Ano</span></div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>

                <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={86} paddingAngle={1}>
                  {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
             <Tooltip formatter={(value) => money(Number(value ?? 0))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-2 text-sm">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} /><span className="text-slate-500">{item.name}</span></div>
                <span className="font-semibold">{money(item.value)}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-4">
          <section className="rounded-[22px] border border-white/80 bg-white p-4 shadow-soft">
            <div className="mb-3 flex items-center gap-2"><BellRing className="h-5 w-5 text-orange-500" /><div><h2 className="font-semibold">Alertas financeiros</h2><p className="text-[11px] text-slate-400">Atenção para os seguintes itens:</p></div></div>
            <div className="space-y-2">
              {[ ["Contas vencidas", "Total de R$ 11.210,00", "5", "rose"], ["Clientes em inadimplência", "Total de R$ 18.430,00", "8", "amber"], ["Saldo baixo em conta", "Conta Caixa com saldo de R$ 850,00", "1", "orange"], ["Pagamentos pendentes", "Total de R$ 12.560,00", "4", "blue"] ].map(([title, sub, count], i) => (
                <button key={title} className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left hover:bg-slate-50">
                  <div className={"flex h-8 w-8 items-center justify-center rounded-lg " + (i === 0 ? "bg-rose-50 text-rose-500" : i === 1 ? "bg-amber-50 text-amber-500" : i === 2 ? "bg-orange-50 text-orange-500" : "bg-blue-50 text-blue-500")}>{i === 1 ? <AlertTriangle className="h-4 w-4" /> : <BellRing className="h-4 w-4" />}</div>
                  <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold">{title}</div><div className="truncate text-[10px] text-slate-400">{sub}</div></div>
                  <span className="text-sm font-bold text-rose-500">{count}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[22px] border border-white/80 bg-white p-4 shadow-soft">
            <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Saldo por conta</h2><button className="text-xs font-semibold text-blue-600">Ver todas</button></div>
            <div className="divide-y divide-slate-100 text-xs">
              {[ ["Conta Corrente - Itaú", 68420], ["Conta Corrente - Bradesco", 32850], ["Caixa", 850], ["Aplicação - CDB", 24310.2] ].map(([name, value]) => (
                <div key={String(name)} className="flex items-center justify-between py-2.5"><span className="text-slate-500">{name}</span><span className="font-semibold">{money(Number(value))}</span></div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="mt-4 grid gap-4 2xl:grid-cols-[1fr_1fr_300px]">
        <TransactionsTable title="Próximos recebimentos" accent="green" rows={receivables} />
        <TransactionsTable title="Próximos pagamentos" accent="red" rows={payables} />
        <section className="rounded-[22px] border border-white/80 bg-white p-4 shadow-soft">
          <div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><Users className="h-4 w-4 text-blue-500" /><h2 className="font-semibold">Top 5 em inadimplência</h2></div><button className="text-xs font-semibold text-blue-600">Ver todos</button></div>
          <div className="space-y-3 text-xs">
            {[ ["João Almeida", 5230], ["Condomínio Beira Mar", 4860], ["Clínica Vida", 3120], ["Residencial das Flores", 2450], ["Academia Movimento", 2180] ].map(([name, value], index) => (
              <div key={String(name)} className="flex items-center gap-3"><span className="w-4 text-slate-400">{index + 1}.</span><span className="flex-1 text-slate-600">{name}</span><span className="font-semibold text-rose-500">{money(Number(value))}</span></div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-[18px] border border-white/80 bg-white px-4 py-3 shadow-soft">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-500"><Lightbulb className="h-4 w-4" /></div>
        <div className="min-w-0 flex-1"><div className="text-sm font-semibold">Dica do PoolControl</div><div className="truncate text-xs text-slate-400">Mantenha suas contas conciliadas para ter um controle financeiro ainda mais preciso.</div></div>
        <button className="hidden rounded-xl bg-slate-50 px-4 py-2 text-xs font-medium text-slate-500 sm:block">Saiba mais ↗</button>
      </div>
    </div>
  );
}

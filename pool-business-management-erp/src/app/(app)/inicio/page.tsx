import { session, company } from "@/lib/backend/client";
import { ButtonLink } from "@/components/ui/button";
import { NewQuoteLink } from "@/components/commercial/new-quote-link";
import Link from "next/link";
import { cookies } from "next/headers";
import {
  Users, ShoppingCart, Boxes, HandCoins, UserRound, Wrench, Waves,
  ChartColumn, Settings, ChevronRight, Zap, ReceiptText,
  TrendingUp, TriangleAlert, CalendarDays, Trophy, Package, ChartNoAxesCombined,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui";
import { NewClientButton } from "@/components/dialogs";
import {
  vendasOverview, stockData, financialData, sellersList,
  workOrdersList, poolsList, customersList,
} from "@/lib/queries";
import { brlCompact, MONTH, TODAY, PERIOD_LABEL } from "@/lib/format";

export const dynamic = "force-dynamic";

type ModuleDef = {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  chip: { icon: React.ReactNode; text: string; tone: "green" | "red" | "blue" | "amber" | "slate" };
};

const chipClass = {
  green: "bg-mint-100 text-mint-600",
  red: "bg-coral-100 text-coral-500",
  blue: "bg-water-100 text-water-700",
  amber: "bg-sun-100 text-[#b57708]",
  slate: "bg-ink-100/70 text-ink-500",
};

export default async function InicioPage() {
  const [user,business] = await Promise.all([session(),company()]);
  const firstName = user.name.split(" ")[0];
  const [vendas, stock, fin, sellers, wos, pools, customers] = await Promise.all([
    vendasOverview(), stockData(), financialData(), sellersList(),
    workOrdersList(), poolsList(), customersList(),
  ]);

  const newClients = customers.filter((c) => c.createdAt.startsWith(MONTH)).length;
  const todayWo = wos.filter((w) => w.scheduledDate === TODAY && w.status !== "CANCELADA").length;

  const modules: ModuleDef[] = [
    {
      href: "/clientes", icon: <Users size={26} strokeWidth={2} />, title: "Clientes",
      desc: "Cadastros, histórico e relacionamento",
      chip: { icon: <Users size={13} />, text: `${newClients} novos clientes`, tone: "blue" },
    },
    {
      href: "/vendas", icon: <ShoppingCart size={26} strokeWidth={2} />, title: "Vendas",
      desc: "Orçamentos, pedidos e margem real",
      chip: { icon: <TrendingUp size={13} />, text: `${vendas.openQuotesCount} orçamentos ativos`, tone: "green" },
    },
    {
      href: "/estoque", icon: <Boxes size={26} strokeWidth={2} />, title: "Estoque",
      desc: "Produtos, entradas, saídas e alertas",
      chip: { icon: <TriangleAlert size={13} />, text: `${stock.critical} itens críticos`, tone: "red" },
    },
    {
      href: "/financeiro", icon: <HandCoins size={26} strokeWidth={2} />, title: "Financeiro",
      desc: "Recebimentos, pagamentos e fluxo de caixa",
      chip: { icon: <ChartNoAxesCombined size={13} />, text: `${brlCompact(fin.toReceive)} a receber`, tone: "green" },
    },
    {
      href: "/vendedores", icon: <UserRound size={26} strokeWidth={2} />, title: "Vendedores",
      desc: "Metas, comissão e desempenho",
      chip: { icon: <Trophy size={13} />, text: `${sellers[0]?.name.split(" ")[0] ?? "—"} lidera o mês`, tone: "amber" },
    },
    {
      href: "/ordens-servico", icon: <Wrench size={26} strokeWidth={2} />, title: "Ordens de Serviço",
      desc: "Instalações, manutenção e equipe",
      chip: { icon: <CalendarDays size={13} />, text: `${todayWo} OS hoje`, tone: "blue" },
    },
    {
      href: "/piscinas", icon: <Waves size={26} strokeWidth={2} />, title: "Piscinas",
      desc: "Modelos, volume, equipamentos e garantia",
      chip: { icon: <Package size={13} />, text: `${pools.length} modelos cadastrados`, tone: "blue" },
    },
    {
      href: "/relatorios", icon: <ChartColumn size={26} strokeWidth={2} />, title: "Relatórios",
      desc: "Indicadores, lucros e análises",
      chip: { icon: <TrendingUp size={13} />, text: "Resultado positivo", tone: "green" },
    },
    {
      href: "/configuracoes", icon: <Settings size={26} strokeWidth={2} />, title: "Configurações",
      desc: "Usuários, permissões e parâmetros",
      chip: { icon: <ShieldCheck size={13} />, text: "Sistema atualizado", tone: "slate" },
    },
  ];

  return (
    <div className="mx-auto max-w-[1680px] px-4 pb-14 pt-7 sm:px-6 lg:px-8">
      {/* ── Hero ── */}
      <Card as="section" className="card home-intro fade-up">
        <div>
          <div className="divider-label mb-3">{business.tradeName || business.legalName} · {PERIOD_LABEL}</div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Bem-vindo, {firstName}</h1>
          <p className="mt-2 text-sm text-ink-500">Tudo para cuidar do seu negócio em um só lugar.</p>
        </div>
        <NewQuoteLink label="Nova venda" />
      </Card>

      <Card as="section" className="card mt-7 p-5 sm:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div><h2 className="text-lg font-extrabold">Seu negócio</h2><p className="mt-1 text-xs text-ink-500">9 módulos · visão geral</p></div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink variant="unstyled" href="/inicio" aria-current="page" className="btn btn-primary !px-4 !py-2">Visão geral</ButtonLink>
            <ButtonLink variant="unstyled" href="/vendas" className="btn btn-neu !px-4 !py-2">Vendas</ButtonLink>
            <ButtonLink variant="unstyled" href="/financeiro" className="btn btn-neu !px-4 !py-2">Financeiro</ButtonLink>
            <ButtonLink variant="unstyled" href="/relatorios" className="btn btn-neu !px-4 !py-2">Relatórios</ButtonLink>
          </div>
        </div>
        <div className="inset-soft home-summary">
          <div><strong>{brlCompact(vendas.revenue)}</strong><span>Vendas do mês</span></div>
          <div><strong className="text-mint-600">{brlCompact(vendas.profit)}</strong><span>Lucro do mês</span></div>
          <div><strong className="text-mint-600">{brlCompact(fin.toReceive)}</strong><span>A receber</span></div>
          <div><strong>{vendas.openQuotesCount}</strong><span>Orçamentos ativos</span></div>
        </div>
      <section className="home-modules mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        {modules.map((m, i) => (
          <Link key={m.href} href={m.href} className="group">
            <Card hover className="module-card fade-up flex h-full flex-col items-start gap-4 p-5" >
              <div className="icon-tile !h-[44px] !w-[44px] shrink-0 !rounded-[14px] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2" style={{ animationDelay: `${i * 50}ms` }}>
                {m.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[17px] font-extrabold tracking-tight text-ink-950">{m.title}</h3>
                <p className="mt-2 text-[12px] font-medium leading-snug text-ink-500 [text-wrap:balance]">{m.desc}</p>
                <span className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${chipClass[m.chip.tone]}`}>
                  {m.chip.icon}
                  {m.chip.text}
                </span>
              </div>
              <span className="neu mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-500 transition-all duration-200 group-hover:translate-x-1 group-hover:text-water-600">
                <ChevronRight size={18} strokeWidth={2.4} />
              </span>
            </Card>
          </Link>
        ))}
      </section>

      </Card>

      {/* ── Ações rápidas ── */}
      <Card className="fade-up mt-7 flex flex-col items-stretch gap-4 p-5 !rounded-[28px] lg:flex-row lg:items-center lg:gap-6 lg:p-6" >
        <div className="flex items-center gap-3.5 lg:pl-2">
          <div className="icon-tile">
            <Zap size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div className="text-[15.5px] font-extrabold text-ink-950">Ações rápidas</div>
            <div className="text-[12px] font-semibold text-ink-300">Agilize seu dia a dia</div>
          </div>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <NewQuoteLink label="Nova venda" />
          <NewClientButton variant="neu" label="Novo cliente" className="w-full" />
          <ButtonLink variant="unstyled" href="/ordens-servico" className="btn btn-neu">
            <Wrench size={16} strokeWidth={2.4} />
            Nova OS
          </ButtonLink>
          <ButtonLink variant="unstyled" href="/financeiro" className="btn btn-neu">
            <ReceiptText size={16} strokeWidth={2.4} />
            Ver financeiro
          </ButtonLink>
        </div>
        <div className="hidden text-right text-[12px] font-semibold leading-relaxed text-ink-300 xl:block xl:pr-2">
          Gestão simples.
          <br />
          Resultados reais.
        </div>
      </Card>
    </div>
  );
}

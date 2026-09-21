import { Trophy, Target, HandCoins, ReceiptText, FileText } from "lucide-react";
import { Card, Badge, PageIntro, SectionTitle, Bar, Avatar, IconTile } from "@/components/ui";
import { sellersList, quotesList } from "@/lib/queries";
import { brl, n, pct } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function VendedoresPage({
  searchParams,
}: {
  searchParams: Promise<{ f?: string }>;
}) {
  const { f = "" } = await searchParams;
  const sellers = await sellersList();
  const quotes = await quotesList();
  const top = sellers[0];
  const openBy = (id: string) =>
    quotes.filter((q) => q.salespersonId === id && (q.status === "ORCAMENTO" || q.status === "NEGOCIACAO")).length;

  const rankingBlock = (
    <Card className="fade-up p-6" >
      <SectionTitle icon={<Trophy size={17} strokeWidth={2.4} />} title="Ranking do mês" />
      <div className="mt-5 space-y-4">
        {sellers.map((s, i) => (
          <div key={s.id} className="flex items-center gap-3.5">
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold ${
              i === 0 ? "bg-sun-100 text-[#b57708]" : i === 1 ? "bg-ink-100/80 text-ink-500" : i === 2 ? "bg-[#f3e6dd] text-[#a0664a]" : "bg-ink-100/50 text-ink-300"
            }`}>
              {i + 1}º
            </span>
            <Avatar name={s.name} size={40} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-[13.5px] font-extrabold text-ink-900">{s.name}</span>
                <span className="text-[13px] font-extrabold tabular-nums text-ink-900">{brl(s.sold)}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2.5">
                <Bar value={s.goalPct} tone={s.goalPct >= 100 ? "green" : undefined} className="flex-1" />
                <span className="text-[11px] font-bold tabular-nums text-ink-300">{pct(s.goalPct, 0)} da meta</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const metasBlock = (
    <Card className="fade-up overflow-hidden p-6 pb-3" >
      <SectionTitle icon={<Target size={17} strokeWidth={2.4} />} title="Metas e comissões de maio" />
      <div className="-mx-6 mt-4 overflow-x-auto">
        <table className="tbl min-w-[720px]">
          <thead>
            <tr>
              <th>Vendedor</th><th className="text-right">Meta</th><th className="text-right">Vendido</th>
              <th className="min-w-[180px]">Progresso</th><th className="text-center">Vendas</th>
              <th className="text-right">Ticket médio</th><th className="text-right">Comissão</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((s) => (
              <tr key={s.id}>
                <td>
                  <div className="flex items-center gap-2.5">
                    <Avatar name={s.name} size={32} />
                    <span className="font-extrabold text-ink-900">{s.name}</span>
                  </div>
                </td>
                <td className="text-right tabular-nums text-ink-500">{brl(n(s.monthlyGoal))}</td>
                <td className="text-right font-bold tabular-nums">{brl(s.sold)}</td>
                <td>
                  <div className="flex items-center gap-2.5">
                    <Bar value={s.goalPct} tone={s.goalPct >= 100 ? "green" : undefined} className="flex-1" />
                    <span className="w-11 text-right text-[12px] font-extrabold tabular-nums text-ink-700">{pct(s.goalPct, 0)}</span>
                  </div>
                </td>
                <td className="text-center font-bold tabular-nums">{s.count}</td>
                <td className="text-right tabular-nums text-ink-500">{brl(s.count ? s.sold / s.count : 0)}</td>
                <td className="text-right font-extrabold tabular-nums text-mint-600">{brl(s.commission)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  return (
    <div className="mx-auto max-w-[1460px]">
      <PageIntro
        crumbs={[{ label: "Início", href: "/inicio" }, { label: "Vendedores" }]}
        title="Vendedores"
        subtitle="Metas, comissão e desempenho — o time que mantém a água circulando."
      />

      {/* Painel do vendedor em destaque */}
      {top && f !== "metas" && (
        <div className="fade-up mt-6 grid gap-5 lg:grid-cols-[1.5fr_1fr_1fr]">
          <Card hover className="relative overflow-hidden p-6" >
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.12]"
              style={{ backgroundImage: "url(/images/water-caustics.jpg)", backgroundSize: "cover" }}
            />
            <div className="relative">
              <div className="flex items-center gap-4">
                <Avatar name={top.name} size={56} />
                <div>
                  <div className="flex items-center gap-2">
                    <Badge tone="amber"><Trophy size={11} />Líder do mês</Badge>
                  </div>
                  <h3 className="mt-1.5 text-[20px] font-extrabold tracking-tight text-ink-950">{top.name}</h3>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-ink-300">Minha meta</div>
                  <div className="text-[20px] font-extrabold tabular-nums text-ink-950">{brl(n(top.monthlyGoal))}</div>
                </div>
                <div>
                  <div className="text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-ink-300">Vendido</div>
                  <div className="text-[20px] font-extrabold tabular-nums text-water-700">{brl(top.sold)}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Bar value={top.goalPct} tone={top.goalPct >= 100 ? "green" : undefined} className="flex-1 !h-[9px]" />
                <span className="text-[13px] font-extrabold tabular-nums text-ink-900">{pct(top.goalPct, 0)}</span>
              </div>
            </div>
          </Card>

          <Card hover className="p-6" >
            <IconTile><HandCoins size={22} strokeWidth={2.2} /></IconTile>
            <div className="mt-3 text-[13px] font-semibold text-ink-500">Comissão acumulada</div>
            <div className="text-[26px] font-extrabold tabular-nums text-mint-600">{brl(top.commission)}</div>
            <div className="mt-1 text-[12px] font-medium text-ink-300">
              Alíquota padrão de {n(top.commissionPct).toLocaleString("pt-BR")}% sobre vendas
            </div>
          </Card>

          <Card hover className="p-6" >
            <IconTile><FileText size={22} strokeWidth={2.2} /></IconTile>
            <div className="mt-3 text-[13px] font-semibold text-ink-500">Pipeline pessoal</div>
            <div className="flex items-baseline gap-4">
              <div>
                <div className="text-[26px] font-extrabold tabular-nums text-ink-950">{openBy(top.id)}</div>
                <div className="text-[11.5px] font-bold text-ink-300">propostas abertas</div>
              </div>
              <div>
                <div className="text-[26px] font-extrabold tabular-nums text-mint-600">{top.count}</div>
                <div className="text-[11.5px] font-bold text-ink-300">vendas fechadas</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {f === "ranking" ? (
        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          {rankingBlock}
          {metasBlock}
        </div>
      ) : f === "metas" ? (
        <div className="mt-6">{metasBlock}</div>
      ) : (
        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.4fr]">
          {rankingBlock}
          {metasBlock}
        </div>
      )}

      <p className="mt-4 flex items-center gap-2 text-[12.5px] font-medium text-ink-300">
        <ReceiptText size={14} className="text-water-500" />
        Regras de comissão por categoria e por margem estão em Vendas → Comissões.
      </p>
    </div>
  );
}

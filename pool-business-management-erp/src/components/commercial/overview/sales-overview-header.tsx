import { Card, PeriodChip, Stat } from "@/components/ui";
import { brl, pct, PERIOD_LABEL } from "@/lib/format";
import {
  ChartColumnBig,
  ChartPie,
  ChevronRight,
  FileText,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { SalesOverviewData } from "./sales-overview-types";

export function SalesOverviewHeader({ ov }: { ov: SalesOverviewData }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_470px]">
      <div className="fade-up">
        <nav className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-300">
          <Link href="/inicio" className="transition hover:text-water-600">
            Início
          </Link>
          <ChevronRight size={12} className="text-ink-300/70" />
          <span className="text-ink-500">Vendas</span>
        </nav>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[46px] leading-[1.02] text-ink-950">
              Vendas
            </h1>
            <p className="mt-1.5 text-[15.5px] font-medium text-ink-500">
              Controle comercial com margem real.
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Stat
            icon={<ChartColumnBig size={22} strokeWidth={2.2} />}
            label="Vendas do mês"
            value={brl(ov.revenue)}
            trend={{
              value: `+${pct(ov.revenueDelta, 0)}`,
              text: "em relação ao mês anterior",
            }}
          />
          <Stat
            icon={<ChartPie size={22} strokeWidth={2.2} />}
            label="Margem média"
            value={pct(ov.marginAvg)}
            trend={{
              value: `+${ov.marginDelta.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} p.p.`,
              text: "no período",
            }}
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Stat
            icon={<Users size={22} strokeWidth={2.2} />}
            label="Comissões"
            value={brl(ov.commissionsMonth)}
            trend={{
              value: `+${pct(ov.commDelta, 0)}`,
              text: "em relação ao mês anterior",
            }}
          />
          <Card hover className="fade-up p-5">
            <div className="flex items-center gap-4">
              <div className="icon-tile">
                <FileText size={22} strokeWidth={2.2} />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-ink-500">
                  Orçamentos em aberto
                </div>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span className="text-[22px] font-extrabold tracking-tight text-ink-900 tabular-nums">
                    {ov.openQuotesCount}
                  </span>
                </div>
                <div className="mt-1.5 text-xs font-bold text-ink-700 tabular-nums">
                  {brl(ov.openQuotesValue)}{" "}
                  <span className="font-medium text-ink-300">em potencial</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Banner com imagem + período */}
      <div
        className="fade-up relative min-h-[300px] overflow-hidden rounded-[28px]"
        style={{ animationDelay: "80ms" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/hero-pool.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/35 via-transparent to-transparent" />
        <Card
          className="card absolute right-4 top-4 w-[190px] !rounded-[22px] p-4"
          style={{
            background: "rgba(11,43,71,.38)",
            border: "1px solid rgba(255,255,255,.25)",
          }}
        >
          <p className="font-display text-[20px] italic leading-snug text-white drop-shadow">
            Água move conquistas
          </p>
          <span className="mt-2 block h-[2px] w-7 rounded-full bg-white/70" />
        </Card>
        <div className="absolute bottom-4 right-4">
          <PeriodChip label={PERIOD_LABEL} />
        </div>
      </div>
    </div>
  );
}

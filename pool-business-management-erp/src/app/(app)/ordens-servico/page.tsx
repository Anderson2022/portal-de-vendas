import { documentCode } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Wrench, CalendarDays, CirclePlay, CircleCheckBig, MapPin,
  Clock3, UserRound, ChevronRight, Droplets,
} from "lucide-react";
import { Card, Badge, PageIntro, Stat, Avatar } from "@/components/ui";
import { advanceWorkOrder } from "@/lib/ordens-servico/advance-work-order";
import { workOrdersList } from "@/lib/queries";
import { dateShort, woFlow, woStatusMap, TODAY } from "@/lib/format";

export const dynamic = "force-dynamic";

const typeLabel: Record<string, string> = {
  INSTALACAO: "Instalação", MANUTENCAO: "Manutenção", LIMPEZA: "Limpeza", REPARO: "Reparo",
};

export default async function OrdensServicoPage({
  searchParams,
}: {
  searchParams: Promise<{ f?: string }>;
}) {
  const { f = "" } = await searchParams;
  const all = await workOrdersList();
  const list =
    f === "hoje" ? all.filter((w) => w.scheduledDate === TODAY)
    : f === "instalacao" ? all.filter((w) => w.type === "INSTALACAO")
    : f === "manutencao" ? all.filter((w) => w.type === "MANUTENCAO" || w.type === "LIMPEZA")
    : all;

  const today = all.filter((w) => w.scheduledDate === TODAY && w.status !== "CANCELADA").length;
  const running = all.filter((w) => w.status === "EXECUCAO" || w.status === "DESLOCAMENTO").length;
  const scheduled = all.filter((w) => w.status === "AGENDADA" || w.status === "PENDENTE").length;
  const done = all.filter((w) => w.status === "CONCLUIDA").length;

  return (
    <div className="mx-auto max-w-[1460px]">
      <PageIntro
        crumbs={[{ label: "Início", href: "/inicio" }, { label: "Ordens de Serviço" }]}
        title="Ordens de Serviço"
        subtitle="Instalações, manutenção e equipe — do agendamento à assinatura do cliente."
      />

      <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat icon={<CalendarDays size={22} strokeWidth={2.2} />} label="OS hoje" value={String(today)} />
        <Stat icon={<CirclePlay size={22} strokeWidth={2.2} />} label="Em execução" value={String(running)} />
        <Stat icon={<Clock3 size={22} strokeWidth={2.2} />} label="Agendadas / pendentes" value={String(scheduled)} />
        <Stat icon={<CircleCheckBig size={22} strokeWidth={2.2} />} label="Concluídas" value={String(done)} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((w, i) => {
          const st = woStatusMap[w.status];
          const stepIdx = woFlow.indexOf(w.status);
          const next = stepIdx >= 0 && stepIdx < woFlow.length - 1 ? woFlow[stepIdx + 1] : null;
          return (
            <Card key={w.id} hover className="fade-up flex flex-col p-5" >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-[15px] font-extrabold text-ink-950">
                  <Wrench size={15} className="text-water-600" />
                  OS #{documentCode(w.number)}
                </span>
                <Badge tone={st.tone}>{st.label}</Badge>
              </div>
              <div className="mt-1 text-[12px] font-bold uppercase tracking-[0.07em] text-ink-300">
                {typeLabel[w.type]}{w.poolModel ? ` · ${w.poolModel}` : ""}
              </div>

              <div className="mt-3 flex items-center gap-3">
                <Avatar name={w.customer} size={36} />
                <div className="min-w-0">
                  <div className="truncate text-[13.5px] font-extrabold text-ink-900">{w.customer}</div>
                  <div className="flex items-center gap-1 truncate text-[11.5px] font-medium text-ink-300">
                    <MapPin size={10} className="shrink-0" />
                    {w.address ?? "—"}
                  </div>
                </div>
              </div>

              {w.notes && (
                <p className="mt-3 rounded-2xl bg-water-50/70 px-3.5 py-2.5 text-[12px] font-medium leading-relaxed text-ink-500">
                  {w.notes}
                </p>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-ink-100/60 pt-3.5">
                <div className="flex items-center gap-3 text-[12px] font-bold text-ink-500">
                  <span className="flex items-center gap-1.5"><CalendarDays size={13} className="text-water-600" />{dateShort(w.scheduledDate)}</span>
                  <span className="flex items-center gap-1.5"><Clock3 size={13} className="text-water-600" />{w.timeSlot ?? "—"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-ink-500">
                  <UserRound size={13} className="text-water-600" />
                  {w.technician}
                </div>
              </div>

              {next && (
                <form action={advanceWorkOrder} className="mt-3">
                  <Input type="hidden" name="id" value={w.id} />
                  <Input type="hidden" name="next" value={next} />
                  <Button variant="unstyled" type="submit" className="btn btn-neu w-full !py-2.5 text-[12.5px]">
                    Avançar para “{woStatusMap[next].label}”
                    <ChevronRight size={14} />
                  </Button>
                </form>
              )}
              {w.status === "CONCLUIDA" && (
                <div className="mt-3 flex items-center justify-center gap-2 rounded-full bg-mint-100/70 py-2.5 text-[12px] font-extrabold text-mint-600">
                  <CircleCheckBig size={14} />
                  Checklist assinado pelo cliente
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <p className="mt-5 flex items-center gap-2 text-[12.5px] font-medium text-ink-300">
        <Droplets size={14} className="text-water-500" />
        Pendente → Agendada → Em deslocamento → Em execução → Concluída. Pausa e cancelamento disponíveis para o gerente.
      </p>
    </div>
  );
}

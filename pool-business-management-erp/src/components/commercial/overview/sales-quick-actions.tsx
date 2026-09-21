import { NewQuoteLink } from "@/components/commercial/new-quote-link";
import { Card } from "@/components/ui";
import { ButtonLink } from "@/components/ui/button";
import {
  CalendarDays,
  HandCoins, Zap
} from "lucide-react";

export function SalesQuickActions() {

  return (
    <Card className="fade-up mt-6 flex flex-col items-stretch gap-4 p-5 !rounded-[26px] lg:flex-row lg:items-center lg:gap-6" >
      <div className="flex items-center gap-3.5 lg:pl-2">
        <div className="icon-tile"><Zap size={21} strokeWidth={2.2} /></div>
        <div>
          <div className="text-[15px] font-extrabold text-ink-950">Ações rápidas</div>
          <div className="text-[12px] font-semibold text-ink-300">Agilize seu dia a dia</div>
        </div>
      </div>
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
        <NewQuoteLink label="Novo orçamento" />
        <NewQuoteLink label="Nova venda" />
        <ButtonLink variant="unstyled" href="/vendas/comissoes" className="btn btn-neu">
          <HandCoins size={16} strokeWidth={2.4} />
          Ver comissão
        </ButtonLink>
      </div>
      <div className="hidden items-center gap-2 text-[12px] font-semibold text-ink-300 xl:flex">
        <CalendarDays size={14} />
        Da oportunidade ao seu próximo sucesso.
      </div>
    </Card>
  );
}

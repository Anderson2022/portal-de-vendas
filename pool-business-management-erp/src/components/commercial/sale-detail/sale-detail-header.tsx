import { Badge, PageIntro } from "@/components/ui";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dateBR, documentCode, saleStatusMap } from "@/lib/format";
import { generateWorkOrder } from "@/lib/ordens-servico/generate-work-order";
import {
  ArrowLeft,
  Wrench
} from "lucide-react";
import type { SaleDetailData } from "./sale-detail-types";

export function SaleDetailHeader({ sale }: { sale: SaleDetailData["sale"] }) {

  return (
    <PageIntro
      crumbs={[
        { label: "Início", href: "/inicio" },
        { label: "Vendas", href: "/vendas" },
        { label: "Pedidos", href: "/vendas/pedidos" },
        { label: `#${documentCode(sale.number)}` },
      ]}
      title={`Venda #${documentCode(sale.number)}`}
      subtitle={`Fechada em ${dateBR(sale.saleDate)} · ${sale.paymentSummary ?? ""}`}
      right={
        <div className="flex items-center gap-3">
          <Badge tone={saleStatusMap[sale.status].tone}>{saleStatusMap[sale.status].label}</Badge>
          <form action={generateWorkOrder}>
            <Input type="hidden" name="saleId" value={sale.id} />
            <Button variant="unstyled" type="submit" className="btn btn-neu">
              <Wrench size={15} strokeWidth={2.4} />
              Gerar OS de instalação
            </Button>
          </form>
          <ButtonLink variant="unstyled" href="/vendas/pedidos" className="btn btn-neu">
            <ArrowLeft size={15} strokeWidth={2.4} />
            Voltar
          </ButtonLink>
        </div>
      }
    />
  );
}

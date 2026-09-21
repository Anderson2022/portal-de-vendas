import { Avatar, Card, SectionTitle } from "@/components/ui";
import { brl, n } from "@/lib/format";
import {
  MapPin,
  UserRound
} from "lucide-react";
import type { SaleDetailData } from "./sale-detail-types";

export function SaleParticipants({ customer, seller, sale }: Pick<SaleDetailData, "customer" | "seller" | "sale">) {

  return (
    <Card className="fade-up p-6" >
      <SectionTitle icon={<UserRound size={17} strokeWidth={2.4} />} title="Cliente e responsável" />
      <div className="mt-4 space-y-4">
        <div className="flex items-center gap-3">
          <Avatar name={customer} size={42} />
          <div>
            <div className="text-[14px] font-extrabold text-ink-900">{customer}</div>
            <div className="flex items-center gap-1 text-[12px] font-medium text-ink-300">
              <MapPin size={11} />
              Cliente desde a base PoolControl
            </div>
          </div>
        </div>
        <div className="h-px bg-ink-100/70" />
        <div className="flex items-center gap-3">
          <Avatar name={seller} size={42} />
          <div>
            <div className="text-[14px] font-extrabold text-ink-900">{seller}</div>
            <div className="text-[12px] font-medium text-ink-300">
              Vendedor responsável · comissão de <b className="text-ink-700">{brl(n(sale.commission))}</b>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

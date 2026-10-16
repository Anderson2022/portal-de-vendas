import { PdvScreen } from "@/components/vendas/pdv/pdv-screen";
import "@/components/vendas/pdv/pdv.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Vendas · PDV · PoolControl" };

export default function VendasPage() {
  return (
    <div className="pdv-embedded">
      <PdvScreen />
    </div>
  );
}

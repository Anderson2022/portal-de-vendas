import { PdvScreen } from "@/components/vendas/pdv/pdv-screen";
import { session } from "@/lib/backend/client";
import "@/components/vendas/pdv/pdv.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "PDV · PoolControl" };

export default async function PdvPage() {
  await session();
  return (
    <div className="pdv-standalone">
      <PdvScreen />
    </div>
  );
}

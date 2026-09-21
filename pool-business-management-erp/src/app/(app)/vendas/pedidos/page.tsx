import { commercialSales } from "@/lib/commercial/queries";
import { SalesScreen } from "@/components/commercial/sales-screen";
export const dynamic = "force-dynamic";
export default async function PedidosPage() {
  return <SalesScreen sales={await commercialSales()} />;
}

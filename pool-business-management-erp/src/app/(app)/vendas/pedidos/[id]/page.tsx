import { SaleDetailScreen } from "@/components/commercial/sale-detail/sale-detail-screen";
import { saleDetail } from "@/lib/queries";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PedidoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await saleDetail(id);
  if (!detail) notFound();
  return <SaleDetailScreen detail={detail} />;
}

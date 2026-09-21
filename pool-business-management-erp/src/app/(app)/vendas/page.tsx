import { SalesOverview } from "@/components/commercial/overview/sales-overview";
import { featuredSale, vendasOverview } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function VendasPage() {
  const ov = await vendasOverview();
  const featured = await featuredSale();
  return <SalesOverview ov={ov} featured={featured} />;
}

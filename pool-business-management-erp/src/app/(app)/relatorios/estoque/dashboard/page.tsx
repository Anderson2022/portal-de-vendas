import { StockDashboard } from "@/components/estoque/dashboard/stock-dashboard";
import { getProductOptions } from "@/lib/estoque/get-product-options";
import { stockData } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function StockDashboardPage() {
  const [stock, productOptions] = await Promise.all([
    stockData(),
    getProductOptions(),
  ]);

  return <StockDashboard s={stock} productOptions={productOptions} />;
}

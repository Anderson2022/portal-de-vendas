import { StockOverview } from "@/components/estoque/painel/stock-overview";
import { stockData } from "@/lib/queries";
import { getProductOptions } from "@/lib/estoque/get-product-options";

export const dynamic = "force-dynamic";

export default async function EstoquePage({
  searchParams,
}: {
  searchParams: Promise<{ f?: string; status?: string }>;
}) {
  const { f = "", status = "" } = await searchParams;
  const [s, productOptions] = await Promise.all([
    stockData(),
    getProductOptions(),
  ]);
  return (
    <StockOverview
      s={s}
      filter={f}
      status={status}
      productOptions={productOptions}
    />
  );
}

import type { stockData } from "@/lib/queries";

export type StockOverviewData = Awaited<ReturnType<typeof stockData>>;

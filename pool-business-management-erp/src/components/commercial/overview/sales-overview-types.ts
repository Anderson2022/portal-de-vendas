import type { featuredSale, vendasOverview } from "@/lib/queries";

export type SalesOverviewData = Awaited<ReturnType<typeof vendasOverview>>;
export type FeaturedSaleData = Awaited<ReturnType<typeof featuredSale>>;

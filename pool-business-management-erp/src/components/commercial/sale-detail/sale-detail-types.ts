import type { saleDetail } from "@/lib/queries";

export type SaleDetailData = NonNullable<Awaited<ReturnType<typeof saleDetail>>>;

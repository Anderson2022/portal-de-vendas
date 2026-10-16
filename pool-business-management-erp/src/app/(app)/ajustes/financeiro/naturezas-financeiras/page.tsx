import { api } from "@/lib/backend/client";
import { getDimensionOptions } from "@/lib/financeiro/dimensoes/get-options";
import type { FinancialNature } from "@/lib/financeiro/naturezas-financeiras/types";
import { FinancialNatureScreen } from "@/components/financeiro/naturezas-financeiras/screen";
export default async function Page() {
  const [rows, options] = await Promise.all([
    api<FinancialNature[]>("/financeiro/cadastros/naturezas-financeiras"),
    getDimensionOptions(),
  ]);
  return <FinancialNatureScreen rows={rows} options={options} />;
}

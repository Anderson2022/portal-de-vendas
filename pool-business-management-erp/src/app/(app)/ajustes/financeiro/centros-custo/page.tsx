import { api } from "@/lib/backend/client";
import { getDimensionOptions } from "@/lib/financeiro/dimensoes/get-options";
import type { CostCenter } from "@/lib/financeiro/centros-custo/types";
import { CostCenterScreen } from "@/components/financeiro/centros-custo/screen";
export default async function Page() {
  const [rows, options] = await Promise.all([
    api<CostCenter[]>("/financeiro/cadastros/centros-custo"),
    getDimensionOptions(),
  ]);
  return <CostCenterScreen rows={rows} options={options} />;
}

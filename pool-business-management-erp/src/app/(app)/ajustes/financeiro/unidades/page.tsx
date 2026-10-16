import { api } from "@/lib/backend/client";
import { getDimensionOptions } from "@/lib/financeiro/dimensoes/get-options";
import type { Unit } from "@/lib/financeiro/unidades/types";
import { UnitScreen } from "@/components/financeiro/unidades/screen";
export default async function Page() {
  const [rows, options] = await Promise.all([
    api<Unit[]>("/financeiro/cadastros/unidades"),
    getDimensionOptions(),
  ]);
  return <UnitScreen rows={rows} options={options} />;
}

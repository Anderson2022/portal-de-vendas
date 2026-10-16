import { api } from "@/lib/backend/client";
import { getDimensionOptions } from "@/lib/financeiro/dimensoes/get-options";
import type { Project } from "@/lib/financeiro/projetos/types";
import { ProjectScreen } from "@/components/financeiro/projetos/screen";
export default async function Page() {
  const [rows, options] = await Promise.all([
    api<Project[]>("/financeiro/cadastros/projetos"),
    getDimensionOptions(),
  ]);
  return <ProjectScreen rows={rows} options={options} />;
}

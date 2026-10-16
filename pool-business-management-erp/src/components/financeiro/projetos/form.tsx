import type { Project } from "@/lib/financeiro/projetos/types";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
import { ProjectSection1 } from "./form-section-1";
import { ProjectSection2 } from "./form-section-2";
import { ProjectSection3 } from "./form-section-3";
export function ProjectForm({
  row,
  options,
}: {
  row: Project | null;
  options: DimensionOptions;
}) {
  return (
    <>
      <p className="text-sm text-slate-500">Empresa: {options.company.name}</p>
      <ProjectSection1 row={row} options={options} />
      <ProjectSection2 row={row} options={options} />
      <ProjectSection3 row={row} options={options} />
    </>
  );
}

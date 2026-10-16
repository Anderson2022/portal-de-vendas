"use client";
import { ProjectBudgetPanel } from "./budget-panel";
import { ProjectResultsPanel } from "./results-panel";
import { HistoryPanel } from "../dimensoes/history-panel";
import { RegisterEditor } from "../dimensoes/register-editor";
import { ProjectForm } from "./form";
import { saveProject } from "@/lib/financeiro/projetos/save";
import type { Project } from "@/lib/financeiro/projetos/types";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
export function ProjectScreen({
  rows,
  options,
}: {
  rows: Project[];
  options: DimensionOptions;
}) {
  return (
    <RegisterEditor
      title="Projetos"
      rows={rows}
      save={saveProject}
      extra={(row) => (
        <>
          <ProjectResultsPanel id={row.id} />
          <ProjectBudgetPanel id={row.id} options={options} />
          <HistoryPanel route="projetos" id={row.id} />
        </>
      )}
      form={(row) => <ProjectForm row={row} options={options} />}
    />
  );
}

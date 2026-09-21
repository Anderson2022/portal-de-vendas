import { formOptions } from "@/lib/commercial/queries";
import { DocumentEditorPage } from "@/components/commercial/document-editor-page";
export const dynamic = "force-dynamic";
export default async function NovoOrcamentoPage() { return <DocumentEditorPage options={await formOptions()}/>; }

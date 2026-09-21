import { notFound } from "next/navigation";
import { commercialQuotes,formOptions } from "@/lib/commercial/queries";
import { DocumentEditorPage } from "@/components/commercial/document-editor-page";
export const dynamic = "force-dynamic";
export default async function EditarOrcamentoPage({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;const [quotes,options]=await Promise.all([commercialQuotes(),formOptions()]);
  const quote=quotes.find(q=>q.id===id);if(!quote||["FECHADO","CANCELADO"].includes(quote.status))notFound();
  return <DocumentEditorPage options={options} quote={quote}/>;
}

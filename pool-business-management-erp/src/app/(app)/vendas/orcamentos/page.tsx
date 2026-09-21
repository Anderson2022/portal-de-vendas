import { commercialQuotes } from "@/lib/commercial/queries";
import { QuotesScreen } from "@/components/commercial/quotes-screen";
export const dynamic = "force-dynamic";
export default async function OrcamentosPage({ searchParams }: {searchParams:Promise<{status?:string;salvo?:string}>}) {
  const [quotes,params]=await Promise.all([commercialQuotes(),searchParams]);
  return <QuotesScreen quotes={quotes} initialStatus={params.status} saved={Boolean(params.salvo)}/>;
}

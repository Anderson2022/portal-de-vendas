import { documentCode } from "@/lib/format";
import { PageIntro } from "@/components/ui";
import { DocumentForm } from "./document-form";
import type { FormOptions } from "@/lib/commercial/domain";
import type { CommercialQuote } from "@/lib/commercial/queries";
export function DocumentEditorPage({
  options,
  quote,
  kind = "quote",
}: {
  options: FormOptions;
  quote?: CommercialQuote;
  kind?: "quote" | "sale";
}) {
  const title =
    kind === "sale"
      ? "Registrar venda"
      : quote
        ? `Editar orçamento #${documentCode(quote.number)}`
        : "Novo orçamento";
  return (
    <div className="mx-auto max-w-[1460px]">
      <PageIntro
        crumbs={[
          { label: "Início", href: "/inicio" },
          {
            label: kind === "quote" ? "Orçamentos" : "Pedidos",
            href: kind === "quote" ? "/vendas/orcamentos" : "/vendas/pedidos",
          },
          { label: title },
        ]}
        title={title}
        subtitle={
          kind === "quote"
            ? "Preencha a proposta em três etapas. Revise os valores antes de salvar."
            : "Use para uma venda já combinada com o cliente, sem orçamento prévio."
        }
      />
      <DocumentForm options={options} quote={quote} kind={kind} />
    </div>
  );
}

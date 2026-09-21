import { Button, ButtonLink } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { Save } from "lucide-react";
import type { DocumentFormProps } from "./document-form-types";

export function DocumentFormActions({ error, kind, pending, back }: { error: string; kind: DocumentFormProps["kind"]; pending: boolean; back: string }) {

  return (
    <div className="mt-5 space-y-3">
      {error && <Notice error>{error}</Notice>}
      <p className="text-xs leading-relaxed text-ink-500">
        {kind === "quote"
          ? "Salvar o orçamento não gera cobrança. Após a aprovação do cliente, use Gerar venda."
          : "Confira os itens e o pagamento antes de confirmar. Custos dos itens e comissão do vendedor compõem o resultado inicial."}
      </p>
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={pending}
      >
        <Save size={16} />
        {pending
          ? "Salvando..."
          : kind === "quote"
            ? "Salvar orçamento"
            : "Registrar venda"}
      </Button>
      <ButtonLink href={back} className="w-full">
        Voltar à listagem
      </ButtonLink>
    </div>
  );
}

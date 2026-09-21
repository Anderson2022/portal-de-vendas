import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
export function NewQuoteLink({ label = "Novo orçamento" }: { label?: string }) {
  return (
    <ButtonLink href="/vendas/orcamentos/novo" variant="primary">
      <Plus size={16} />
      {label}
    </ButtonLink>
  );
}

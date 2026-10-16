import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export function NewSaleLink() {
  return (
    <ButtonLink href="/vendas" variant="primary">
      <Plus size={16} />
      Nova venda
    </ButtonLink>
  );
}

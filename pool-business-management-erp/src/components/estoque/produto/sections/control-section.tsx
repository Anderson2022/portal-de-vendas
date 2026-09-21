import { Settings2 } from "lucide-react";

import { CheckOption } from "../fields/check-option";
import { ProductSection } from "../product-section";

export function ControlSection() {
  return (
    <ProductSection
      icon={<Settings2 size={17} />}
      title="Controle"
      description="Rastreabilidade e comportamento do estoque."
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <CheckOption name="batchControlled" label="Controlar lote" />
        <CheckOption name="expirationControlled" label="Controlar validade" />
        <CheckOption name="serialControlled" label="Controlar nº de série" />
        <CheckOption name="active" label="Produto ativo" defaultChecked />
        <CheckOption name="stockControlled" label="Controlar estoque" defaultChecked />
        <CheckOption name="showInSales" label="Exibir na venda" defaultChecked />
        <CheckOption name="allowFractionalSale" label="Permitir venda fracionada" />
        <CheckOption name="requiresInstallation" label="Exige instalação" />
      </div>
    </ProductSection>
  );
}

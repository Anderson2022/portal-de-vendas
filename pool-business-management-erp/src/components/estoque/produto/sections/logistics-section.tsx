import { ProductLookupField } from "../lookup/product-lookup-field";
import { Truck } from "lucide-react";
import { DetailField } from "../fields/detail-field";
import { ProductSection } from "../product-section";

export function LogisticsSection() {
  return (
    <ProductSection icon={<Truck size={17} />} title="Compra, embalagem e transporte" description="Dimensões da embalagem e condições de fornecimento.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ProductLookupField label="Fornecedor principal" name="supplierId" kind="supplier" valueMode="id" draftName="supplierName" />
        <DetailField label="Código no fornecedor" name="supplierProductCode" />
        <ProductLookupField label="Unidade de compra" name="purchaseUnitId" kind="unit" valueMode="id" draftName="purchaseUnit" />
        <ProductLookupField label="Unidades por embalagem" name="unitsPerPackage" kind="packageQuantity" />
        <DetailField label="Prazo de reposição (dias)" name="leadTimeDays" type="number" min="0" step="1" />
        <DetailField label="Pedido mínimo de compra" name="minimumPurchaseQuantity" type="number" min="0" step="0.001" />
        <DetailField label="Peso líquido (kg)" name="netWeight" type="number" min="0" step="0.001" />
        <DetailField label="Peso bruto (kg)" name="grossWeight" type="number" min="0" step="0.001" />
        <DetailField label="Comprimento da embalagem (cm)" name="packageLength" type="number" min="0" step="0.01" />
        <DetailField label="Largura da embalagem (cm)" name="packageWidth" type="number" min="0" step="0.01" />
        <DetailField label="Altura da embalagem (cm)" name="packageHeight" type="number" min="0" step="0.01" />
        <DetailField label="Condições de armazenamento" name="storageConditions" />
      </div>
    </ProductSection>
  );
}

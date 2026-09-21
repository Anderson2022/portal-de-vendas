import { ProductLookupField } from "../lookup/product-lookup-field";
import { ReceiptText } from "lucide-react";
import { DetailField } from "../fields/detail-field";
import { ProductSection } from "../product-section";

export function FiscalSection() {
  return (
    <ProductSection icon={<ReceiptText size={17} />} title="Classificação fiscal" description="Dados complementares para a ficha do produto. Sem cálculo automático de tributos.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DetailField label="NCM" name="ncm" inputMode="numeric" pattern="[0-9]{8}" maxLength={8} placeholder="8 dígitos" />
        <DetailField label="CEST" name="cest" inputMode="numeric" pattern="[0-9]{7}" maxLength={7} placeholder="7 dígitos" />
        <DetailField label="Origem da mercadoria" name="fiscalOrigin" placeholder="Código / descrição" />
        <DetailField label="CFOP de venda" name="saleCfop" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} />
        <DetailField label="CST / CSOSN — ICMS" name="icmsCode" maxLength={3} />
        <DetailField label="CST — PIS" name="pisCode" maxLength={2} />
        <DetailField label="CST — COFINS" name="cofinsCode" maxLength={2} />
        <DetailField label="CST — IPI" name="ipiCode" maxLength={2} />
        <ProductLookupField label="Unidade tributável" name="taxUnitId" kind="unit" valueMode="id" draftName="taxUnit" />
        <DetailField label="GTIN tributável" name="taxBarcode" maxLength={14} />
        <DetailField label="Fator de conversão tributável" name="taxConversionFactor" type="number" min="0.000001" step="0.000001" />
        <DetailField label="Código de benefício fiscal" name="taxBenefitCode" />
      </div>
    </ProductSection>
  );
}

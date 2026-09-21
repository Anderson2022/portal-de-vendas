import { Wrench } from "lucide-react";
import { DetailField } from "../fields/detail-field";
import { ProductLookupField } from "../lookup/product-lookup-field";
import { ProductSection } from "../product-section";

export function TechnicalSection() {
  return (
    <ProductSection icon={<Wrench size={17} />} title="Características técnicas">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DetailField label="Compatibilidade" name="compatibility" />
        <DetailField label="Assistência técnica" name="technicalSupport" />
        <ProductLookupField label="Garantia geral (meses)" name="generalWarrantyMonths" kind="warranty" />
        <DetailField label="Link do manual" name="manualUrl" type="url" placeholder="https://..." />
      </div>
    </ProductSection>
  );
}

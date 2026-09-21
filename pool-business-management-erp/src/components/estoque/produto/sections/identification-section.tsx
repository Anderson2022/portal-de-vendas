import { ProductLookupField } from "../lookup/product-lookup-field";
import { Tag } from "lucide-react";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

import { ProductSection } from "../product-section";
import type { ProductType } from "../product-types";

type Props = {
  productType: ProductType;
  onProductTypeChange: (type: ProductType) => void;
};

export function IdentificationSection({
  productType,
  onProductTypeChange,
}: Props) {
  return (
    <ProductSection
      icon={<Tag size={17} />}
      title="Identificação"
      description="Informações principais do produto."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
        <div className="sm:col-span-3">
          <Field label="Código interno">
            <Input name="internalCode" className="input" placeholder="PRD-00001" />
          </Field>
        </div>

        <div className="sm:col-span-3">
          <Field label="SKU">
            <Input name="sku" maxLength={60} className="input" placeholder="MOT-13-220" />
          </Field>
        </div>

        <div className="sm:col-span-3">
          <Field label="Código de barras">
            <Input name="barcode" maxLength={60} className="input" placeholder="789..." />
          </Field>
        </div>

        <div className="sm:col-span-3">
          <Field label="Referência fabricante">
            <Input name="manufacturerReference" className="input" />
          </Field>
        </div>

        <div className="sm:col-span-8">
          <Field label="Nome">
            <Input
              required
              name="name"
              maxLength={180}
              className="input"
              placeholder="Motor 1/3 CV 220V"
            />
          </Field>
        </div>

        <div className="sm:col-span-4">
          <Field label="Tipo">
            <Select
              name="productType"
              value={productType}
              className="input"
              onChange={(e) => onProductTypeChange(e.target.value as ProductType)}
            >
              <option value="STANDARD">Produto comum</option>
              <option value="POOL">Piscina</option>
              <option value="MOTOR">Motor / Bomba</option>
              <option value="FILTER">Filtro</option>
              <option value="CHEMICAL">Produto químico</option>
              <option value="ACCESSORY">Acessório</option>
              <option value="KIT">Kit</option>
            </Select>
          </Field>
        </div>

        <div className="sm:col-span-4">
          <ProductLookupField label="Categoria" name="categoryId" kind="category" valueMode="id" />
        </div>

        <div className="sm:col-span-4">
          <ProductLookupField label="Marca" name="brandId" kind="brand" valueMode="id" draftName="brandName" />
        </div>

        <div className="sm:col-span-4">
          <ProductLookupField label="Unidade" name="unitId" kind="unit" defaultValue="UN" valueMode="id" draftName="unit" required />
        </div>

        <div className="sm:col-span-3">
          <ProductLookupField label="Fabricante" name="manufacturerId" kind="manufacturer" valueMode="id" draftName="manufacturer" />
        </div>

        <div className="sm:col-span-3">
          <ProductLookupField label="Modelo / linha" name="modelId" kind="model" valueMode="id" draftName="model" />
        </div>

        <div className="sm:col-span-3">
          <ProductLookupField label="Material" name="materialId" kind="material" valueMode="id" draftName="material" />
        </div>

        <div className="sm:col-span-3">
          <ProductLookupField label="Acabamento / cor" name="finishId" kind="finish" valueMode="id" draftName="finish" />
        </div>

        <div className="sm:col-span-12">
          <Field label="Descrição">
            <textarea
              name="description"
              maxLength={1000}
              rows={3}
              className="input min-h-[90px] w-full resize-none"
              placeholder="Descrição, observações e características..."
            />
          </Field>
        </div>
      </div>
    </ProductSection>
  );
}

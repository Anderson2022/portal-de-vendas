"use client";

import { useId, type ReactNode } from "react";
import { Notice } from "@/components/ui/notice";
import { CommercialSection } from "./sections/commercial-section";
import { ControlSection } from "./sections/control-section";
import { IdentificationSection } from "./sections/identification-section";
import { StockSection } from "./sections/stock-section";
import { FiscalSection } from "./sections/fiscal-section";
import { LogisticsSection } from "./sections/logistics-section";
import { TechnicalSection } from "./sections/technical-section";
import { MediaSection } from "./sections/media-section";
import { SpecificFields } from "./specific-fields/specific-fields";
import { ProductFormActions } from "./product-form-actions";
import { ProductTabs, productTabs } from "./product-tabs";
import { useProductForm } from "./use-product-form";
import type { ProductFormProps, ProductTab } from "./product-types";
import { ProductLookupProvider } from "./lookup/product-lookup-provider";

export function ProductForm(props: ProductFormProps) {
  const { categories, brands, warehouses, suppliers, onCancel, onSuccess } = props;
  const { tab: activeTab, setTab, productType, setProductType, error, done, warning, pending, formRef, submit, exportSheet } = useProductForm(props);
  const prefix = useId();
  const panels: Record<ProductTab, ReactNode> = {
    basic: <IdentificationSection productType={productType} onProductTypeChange={setProductType} />,
    prices: <CommercialSection />,
    stock: <><StockSection productId={props.product?.id} /><ControlSection /></>,
    fiscal: <FiscalSection />,
    details: <><TechnicalSection /><SpecificFields type={productType} /><LogisticsSection /></>,
    media: <MediaSection />,
  };
  return (
    <ProductLookupProvider categories={categories} brands={brands} warehouses={warehouses} suppliers={suppliers} initialValues={props.product?.values}>
    <form ref={formRef} onSubmit={submit} noValidate className="flex min-h-full flex-col gap-5">
      {error && <Notice error>{error}</Notice>}
      {done && <div role="status"><Notice>Produto cadastrado. Você pode exportar a ficha completa antes de concluir.</Notice></div>}
      {warning && <Notice error>{warning}</Notice>}
      <fieldset disabled={pending || done} className="min-w-0 flex-1 space-y-5">
        <ProductTabs active={activeTab} onChange={setTab} prefix={prefix} />
        {productTabs.map((tab) => (
          <div key={tab.id} id={prefix + "-" + tab.id} role="tabpanel" aria-labelledby={prefix + "-" + tab.id + "-tab"}
            data-product-tab={tab.id} hidden={activeTab !== tab.id} className="space-y-5">
            {panels[tab.id]}
          </div>
        ))}
      </fieldset>
      <ProductFormActions pending={pending} done={done} onExport={exportSheet}
        editing={Boolean(props.product)}
        onCancel={() => { if (!pending) (done ? onSuccess : onCancel)?.(); }} />
    </form>
    </ProductLookupProvider>
  );
}

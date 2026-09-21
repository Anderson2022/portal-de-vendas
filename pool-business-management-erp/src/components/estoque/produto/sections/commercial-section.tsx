"use client";

import { useState } from "react";
import { DollarSign } from "lucide-react";
import { brl, pct } from "@/lib/format";
import { productPricing } from "@/lib/estoque/product-pricing";
import { MoneyField } from "../fields/money-field";
import { DetailField } from "../fields/detail-field";
import { ProductSection } from "../product-section";
import { PriceVariants } from "../price-variants";
import { useProductLookup } from "../lookup/product-lookup-provider";

export function CommercialSection() {
  const lookup = useProductLookup();
  const [cost, setCost] = useState(() => lookup.initial("initialCost"));
  const [price, setPrice] = useState(() => lookup.initial("salePrice"));
  const pricing = productPricing(Number(cost), Number(price));
  return (
    <>
      <ProductSection icon={<DollarSign size={17} />} title="Preço principal" description="Margem sobre a venda e markup sobre o custo. Valores antes de impostos, comissões e frete.">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MoneyField label="Custo inicial" name="initialCost" value={cost} onChange={(event) => setCost(event.target.value)} />
          <MoneyField label="Preço de venda" name="salePrice" required value={price} onChange={(event) => setPrice(event.target.value)} />
          <div><span className="text-xs font-bold text-ink-700">Resultado unitário</span><output className="mt-3 block font-extrabold tabular-nums">{brl(pricing.profit)}</output></div>
          <div><span className="text-xs font-bold text-ink-700">Margem sobre venda</span><output className="mt-3 block font-extrabold tabular-nums">{Number(price) > 0 ? pct(pricing.margin) : "—"}</output></div>
          <div><span className="text-xs font-bold text-ink-700">Markup sobre custo</span><output className="mt-3 block font-extrabold tabular-nums">{Number(cost) > 0 ? pct(pricing.markup) : "—"}</output></div>
        </div>
        {Number(price) > 0 && Number(price) < Number(cost) && <p role="status" className="mt-3 text-xs font-bold text-coral-500">O preço informado está abaixo do custo.</p>}
      </ProductSection>
      <ProductSection title="Política comercial" description="Informações complementares incluídas na ficha exportada.">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MoneyField label="Preço mínimo" name="minimumSalePrice" />
          <MoneyField label="Preço promocional" name="promotionalPrice" />
          <DetailField label="Início da promoção" name="promotionStartsAt" type="date" />
          <DetailField label="Fim da promoção" name="promotionEndsAt" type="date" />
          <DetailField label="Margem mínima (%)" name="minimumMargin" type="number" min="0" max="100" step="0.01" />
          <DetailField label="Desconto máximo (%)" name="maximumDiscount" type="number" min="0" max="100" step="0.01" />
          <DetailField label="Comissão (%)" name="commissionRate" type="number" min="0" max="100" step="0.01" />
          <DetailField label="Quantidade mínima de venda" name="minimumSaleQuantity" type="number" min="0.001" step="0.001" />
        </div>
      </ProductSection>
      <PriceVariants />
    </>
  );
}

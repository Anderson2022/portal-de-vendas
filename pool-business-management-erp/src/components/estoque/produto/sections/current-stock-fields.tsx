"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { getProductStockSummary, type ProductStockSummary } from "@/lib/estoque/get-product-stock-summary";

const empty: ProductStockSummary = { physical: 0, reserved: 0, available: 0 };

export function CurrentStockFields({ productId }: { productId: string }) {
  const [stock, setStock] = useState<ProductStockSummary>(empty);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void getProductStockSummary(productId)
      .then((result) => { if (active) setStock(result); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [productId]);

  return <>
    {([
      ["Estoque físico atual", stock.physical],
      ["Estoque reservado", stock.reserved],
      ["Estoque disponível", stock.available],
    ] as const).map(([label, value]) => <Field key={label} label={label}>
      <Input readOnly value={loading ? "Carregando..." : String(value)} className="input font-bold" />
    </Field>)}
  </>;
}

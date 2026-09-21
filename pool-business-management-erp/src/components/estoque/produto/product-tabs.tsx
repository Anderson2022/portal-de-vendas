import { Button } from "@/components/ui/button";
import type { ProductTab } from "./product-types";

export const productTabs: { id: ProductTab; label: string }[] = [
  { id: "basic", label: "Informações básicas" },
  { id: "prices", label: "Preços e venda" },
  { id: "stock", label: "Estoque e controle" },
  { id: "fiscal", label: "Informações fiscais" },
  { id: "details", label: "Ficha técnica e logística" },
  { id: "media", label: "Imagem e observações" },
];

export function ProductTabs({ active, onChange, prefix }: {
  active: ProductTab; onChange: (tab: ProductTab) => void; prefix: string;
}) {
  return (
    <div role="tablist" aria-label="Cadastro de produto" className="flex gap-2 overflow-x-auto border-b border-ink-100 pb-4">
      {productTabs.map((tab, index) => (
        <Button key={tab.id} role="tab" id={`${prefix}-${tab.id}-tab`}
          className="shrink-0 whitespace-nowrap !px-3 !py-2 !text-xs"
          aria-controls={`${prefix}-${tab.id}`} aria-selected={active === tab.id}
          tabIndex={active === tab.id ? 0 : -1}
          variant={active === tab.id ? "primary" : "secondary"}
          onClick={() => onChange(tab.id)}
          onKeyDown={(event) => {
            const next = event.key === "ArrowRight" ? (index + 1) % productTabs.length
              : event.key === "ArrowLeft" ? (index + productTabs.length - 1) % productTabs.length
              : event.key === "Home" ? 0 : event.key === "End" ? productTabs.length - 1 : -1;
            if (next < 0) return;
            event.preventDefault();
            onChange(productTabs[next].id);
            document.getElementById(`${prefix}-${productTabs[next].id}-tab`)?.focus();
          }}>
          {tab.label}
        </Button>
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import { DemoHeader } from "./demo-header";
import { DemoOverview } from "./demo-overview";
import { DemoClients } from "./clientes/demo-clients";
import { DemoStock } from "./estoque/demo-stock";
import { DemoSales } from "./vendas/demo-sales";
import { DemoFinancial } from "./financeiro/demo-financial";
import { useDemoSession } from "./hooks/use-demo-session";
import { createDemoSale } from "@/lib/demonstracao/create-demo-sale";
import type { DemoSection } from "@/lib/demonstracao/types/demo-state";

export function DemoScreen({ autoStart = false }: { autoStart?: boolean }) {
  const { state, error, update, reset, exit } = useDemoSession(autoStart);
  const [section, setSection] = useState<DemoSection>("inicio");
  if (!state)
    return (
      <p role="status" className="p-10 text-center">
        Preparando demonstração…
      </p>
    );
  return (
    <>
      <DemoHeader
        section={section}
        onSelect={setSection}
        onReset={reset}
        onExit={exit}
      />
      <main className="mx-auto max-w-[1460px] px-6 py-8">
        <p className="mb-6 rounded-2xl bg-water-100 p-4 text-sm text-water-700">
          Modo de apresentação · As alterações ficam no seu navegador e são
          apagadas ao sair desta página. Nenhum dado é enviado ao banco.
        </p>
        {error && (
          <p
            role="alert"
            className="mb-4 rounded-xl bg-coral-100 p-4 text-sm text-coral-500"
          >
            {error}
          </p>
        )}
        {section === "inicio" && <DemoOverview state={state} />}
        {section === "clientes" && (
          <DemoClients
            error={error}
            clients={state.clients}
            onSave={(client) =>
              update((current) => ({
                ...current,
                clients: [...current.clients, client],
              }))
            }
          />
        )}
        {section === "estoque" && (
          <DemoStock
            error={error}
            products={state.products}
            onSave={(product) =>
              update((current) => {
                if (
                  current.products.some(
                    (item) =>
                      item.sku.toLowerCase() === product.sku.toLowerCase(),
                  )
                )
                  throw new Error("Já existe um produto com esse SKU.");
                return { ...current, products: [...current.products, product] };
              })
            }
          />
        )}
        {section === "vendas" && (
          <DemoSales
            error={error}
            state={state}
            onSave={(clientId, productId, quantity) =>
              update((current) =>
                createDemoSale(current, clientId, productId, quantity),
              )
            }
          />
        )}
        {section === "financeiro" && (
          <DemoFinancial
            error={error}
            payables={state.payables}
            onSave={(payable) =>
              update((current) => ({
                ...current,
                payables: [...current.payables, payable],
              }))
            }
            onPay={(id) =>
              update((current) => ({
                ...current,
                payables: current.payables.map((payable) =>
                  payable.id === id ? { ...payable, paid: true } : payable,
                ),
              }))
            }
          />
        )}
      </main>
    </>
  );
}

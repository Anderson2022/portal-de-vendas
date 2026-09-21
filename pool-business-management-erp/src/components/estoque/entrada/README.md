# PoolControl — Entrada de Estoque

Componente frontend completo de Entrada de Estoque em modal grande.

Estrutura:

components/
└── estoque/
    └── entrada/
        ├── stock-entry-button.tsx
        ├── stock-entry-modal.tsx
        ├── stock-entry-form.tsx
        ├── stock-entry-tabs.tsx
        ├── stock-entry-item-form.tsx
        ├── stock-entry-item-table.tsx
        ├── stock-entry-totals.tsx
        ├── stock-entry-actions.tsx
        ├── stock-entry-types.ts
        ├── sections/
        └── tabs/

## Exemplo

```tsx
import { StockEntryButton } from "@/components/estoque/entrada";

<StockEntryButton
  products={products}
  suppliers={suppliers}
  warehouses={warehouses}
  costCenters={costCenters}
  onSubmit={async (data) => {
    console.log(data);
  }}
/>
```

O `onSubmit` foi deixado desacoplado do backend para o componente não depender de
um endpoint de entrada que ainda não exista na API atual.

Quando o backend de entradas estiver pronto, conecte o `onSubmit` à Server Action
correspondente.

import { Card } from "@/components/ui/card";
import { brl } from "@/lib/format";
import type { DemoState } from "@/lib/demonstracao/types/demo-state";

export function DemoSalesTable({ state }: { state: DemoState }) {
  return (
    <Card className="mt-6 overflow-x-auto p-4">
      <table className="tbl w-full min-w-[540px]">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {state.sales.map((sale) => (
            <tr key={sale.id}>
              <td>
                {
                  state.clients.find((client) => client.id === sale.clientId)
                    ?.name
                }
              </td>
              <td>
                {
                  state.products.find(
                    (product) => product.id === sale.productId,
                  )?.name
                }
              </td>
              <td>{sale.quantity}</td>
              <td>{brl(sale.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {state.sales.length === 0 && (
        <p className="p-4 text-sm text-ink-500">Nenhuma venda simulada.</p>
      )}
    </Card>
  );
}

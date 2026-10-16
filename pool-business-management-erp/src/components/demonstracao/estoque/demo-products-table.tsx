import { Card } from "@/components/ui/card";
import { brl } from "@/lib/format";
import type { DemoProduct } from "@/lib/demonstracao/types/demo-product";

export function DemoProductsTable({ products }: { products: DemoProduct[] }) {
  return (
    <Card className="mt-6 overflow-x-auto p-4">
      <table className="tbl w-full min-w-[540px]">
        <thead>
          <tr>
            <th>Produto</th>
            <th>SKU</th>
            <th>Disponível</th>
            <th>Preço</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="font-bold">{product.name}</td>
              <td>{product.sku}</td>
              <td>{product.quantity}</td>
              <td>{brl(product.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <p className="p-4 text-sm text-ink-500">Nenhum produto cadastrado.</p>
      )}
    </Card>
  );
}

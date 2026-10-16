import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { brl, dateBR } from "@/lib/format";
import type { DemoPayable } from "@/lib/demonstracao/types/demo-payable";

export function DemoPayablesTable({
  payables,
  onPay,
}: {
  payables: DemoPayable[];
  onPay: (id: string) => void;
}) {
  return (
    <Card className="mt-6 overflow-x-auto p-4">
      <table className="tbl w-full min-w-[620px]">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Vencimento</th>
            <th>Valor</th>
            <th>Situação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {payables.map((payable) => (
            <tr key={payable.id}>
              <td>{payable.description}</td>
              <td>{dateBR(payable.dueDate)}</td>
              <td>{brl(payable.amount)}</td>
              <td>{payable.paid ? "Pago" : "Em aberto"}</td>
              <td>
                <Button
                  disabled={payable.paid}
                  onClick={() => onPay(payable.id)}
                >
                  Simular pagamento
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {payables.length === 0 && (
        <p className="p-4 text-sm text-ink-500">Nenhuma conta cadastrada.</p>
      )}
    </Card>
  );
}

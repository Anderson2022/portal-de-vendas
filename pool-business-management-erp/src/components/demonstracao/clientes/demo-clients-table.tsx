import { Card } from "@/components/ui/card";
import type { DemoClient } from "@/lib/demonstracao/types/demo-client";

export function DemoClientsTable({ clients }: { clients: DemoClient[] }) {
  return (
    <Card className="mt-6 overflow-x-auto p-4">
      <table className="tbl w-full min-w-[540px]">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>E-mail</th>
            <th>Telefone</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td className="font-bold">{client.name}</td>
              <td>{client.email || "—"}</td>
              <td>{client.phone || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {clients.length === 0 && (
        <p className="p-4 text-sm text-ink-500">Nenhum cliente cadastrado.</p>
      )}
    </Card>
  );
}

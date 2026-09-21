import { Card } from "@/components/ui";
export function PoolCard({
  pool,
  customer,
}: {
  pool: {
    name: string;
    sizeLabel: string;
    volumeLiters: number;
    equipment: string;
    warrantyUntil: string | null;
  };
  customer: string;
}) {
  return (
    <Card hover className="p-5">
      <h3 className="text-lg font-extrabold">{pool.name || "Piscina"}</h3>
      <p className="mt-1 text-sm text-ink-500">{customer}</p>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-ink-500">Dimensões</dt>
          <dd>{pool.sizeLabel}</dd>
        </div>
        <div>
          <dt className="text-ink-500">Volume</dt>
          <dd>{pool.volumeLiters.toLocaleString("pt-BR")} litros</dd>
        </div>
        <div>
          <dt className="text-ink-500">Garantia até</dt>
          <dd>
            {pool.warrantyUntil
              ? pool.warrantyUntil.slice(0, 10).split("-").reverse().join("/")
              : "Não informada"}
          </dd>
        </div>
        <div>
          <dt className="text-ink-500">Equipamentos</dt>
          <dd>{pool.equipment || "Não informados"}</dd>
        </div>
      </dl>
    </Card>
  );
}

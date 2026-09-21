import { Waves, Droplets, ShieldCheck } from "lucide-react";
import { PageIntro, Stat } from "@/components/ui";
import { EmptyState } from "@/components/ui/empty-state";
import { PoolCard } from "@/components/pools/pool-card";
import { poolsList, customersList } from "@/lib/queries";
import { TODAY } from "@/lib/format";
export const dynamic = "force-dynamic";
export default async function PiscinasPage() {
  const [pools, customers] = await Promise.all([poolsList(), customersList()]);
  const names = new Map(customers.map((c) => [c.id, c.name]));
  return (
    <div className="mx-auto max-w-[1460px]">
      <PageIntro
        crumbs={[{ label: "Início", href: "/inicio" }, { label: "Piscinas" }]}
        title="Piscinas"
        subtitle="Piscinas dos clientes, medidas, equipamentos e garantia."
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat
          icon={<Waves size={22} />}
          label="Piscinas cadastradas"
          value={String(pools.length)}
        />
        <Stat
          icon={<Droplets size={22} />}
          label="Volume total"
          value={
            (
              pools.reduce((sum, p) => sum + p.volumeLiters, 0) / 1000
            ).toLocaleString("pt-BR") + " m³"
          }
        />
        <Stat
          icon={<ShieldCheck size={22} />}
          label="Garantias vigentes"
          value={String(
            pools.filter((p) => p.warrantyUntil && p.warrantyUntil >= TODAY)
              .length,
          )}
        />
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {pools.map((p) => (
          <PoolCard
            key={p.id}
            pool={p}
            customer={names.get(p.customerId) || "Cliente"}
          />
        ))}
      </div>
      {!pools.length && (
        <EmptyState
          title="Nenhuma piscina cadastrada"
          description="As piscinas vinculadas aos clientes aparecerão aqui após o cadastro."
        />
      )}
    </div>
  );
}

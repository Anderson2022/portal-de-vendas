"use client";

import { useEffect, useState, useTransition } from "react";
import { CheckCircle2, PackageSearch } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

import { createStockMovement } from "@/lib/estoque/create-stock-movement";
import { listStockLocations, listStockSites, listStockWarehouses, type StockStructureOption } from "@/lib/estoque/stock-structure";

import { MainSection } from "./sections/main-section";
import { ReferenceSection } from "./sections/reference-section";
import { TraceabilitySection } from "./sections/traceability-section";
import type {
  StockMovementFormProps,
  StockMovementType,
} from "./movement-types";

export function StockMovementForm({
  products,
  warehouses,
  suppliers = [],
  onSuccess,
  onCancel,
}: StockMovementFormProps) {
  const [movementType, setMovementType] =
    useState<StockMovementType>("ENTRADA");
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const [sites,setSites]=useState<StockStructureOption[]>([]);
  const [structureWarehouses,setStructureWarehouses]=useState<StockStructureOption[]>([]);
  const [locations,setLocations]=useState<StockStructureOption[]>([]);
  const [siteId,setSiteId]=useState("");
  const [warehouseId,setWarehouseId]=useState("");
  useEffect(()=>{void Promise.all([listStockSites(),listStockWarehouses()]).then(([s,w])=>{setSites(s);setStructureWarehouses(w);});},[]);
  useEffect(()=>{setLocations([]);if(warehouseId)void listStockLocations(warehouseId).then(setLocations);},[warehouseId]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      await createStockMovement(formData);

      setDone(true);
      router.refresh();

      setTimeout(() => {
        setDone(false);
        setMovementType("ENTRADA");
        onSuccess?.();
      }, 1100);
    });
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle2 size={46} className="text-mint-500" />

        <strong className="text-[16px] text-ink-900">
          Movimentação registrada
        </strong>

        <p className="text-[13px] text-ink-300">
          O saldo e o histórico do estoque foram atualizados.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="rounded-[22px] border border-white/70 bg-white/60 p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 shadow-inner">
            <PackageSearch size={17} />
          </div>

          <div>
            <h3 className="text-[14px] font-extrabold text-ink-900">
              Dados da movimentação
            </h3>

            <p className="text-[12px] text-ink-300">
              Informe produto, depósito, tipo, quantidade e custo.
            </p>
          </div>
        </div>

        <MainSection
          products={products}
          sites={sites}
          warehouses={(structureWarehouses.length?structureWarehouses:warehouses).filter(w=>!siteId||String((w as StockStructureOption).site_id)===siteId)}
          locations={locations}
          siteId={siteId}
          warehouseId={warehouseId}
          onSiteChange={value=>{setSiteId(value);setWarehouseId("");}}
          onWarehouseChange={setWarehouseId}
          movementType={movementType}
          onMovementTypeChange={setMovementType}
        />
      </div>

      <div className="rounded-[22px] border border-white/70 bg-white/60 p-5 shadow-sm">
        <h3 className="mb-4 text-[14px] font-extrabold text-ink-900">
          Origem e referência
        </h3>

        <ReferenceSection
          suppliers={suppliers}
          movementType={movementType}
        />
      </div>

      <div className="rounded-[22px] border border-white/70 bg-white/60 p-5 shadow-sm">
        <h3 className="mb-4 text-[14px] font-extrabold text-ink-900">
          Rastreabilidade
        </h3>

        <TraceabilitySection />
      </div>

      <Field label="Observações">
        <textarea
          name="reason"
          rows={3}
          className="input min-h-[90px] w-full resize-none"
          placeholder="Detalhes adicionais da movimentação..."
        />
      </Field>

      <div className="flex justify-end gap-3 border-t pt-5">
        <Button
          variant="unstyled"
          type="button"
          disabled={pending}
          onClick={onCancel}
          className="btn btn-neu"
        >
          Cancelar
        </Button>

        <Button
          variant="unstyled"
          type="submit"
          disabled={pending}
          className="btn btn-primary"
        >
          {pending ? "Registrando..." : "Registrar movimentação"}
        </Button>
      </div>
    </form>
  );
}

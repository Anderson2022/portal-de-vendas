import { usePdv } from "../pdv-context";
import { PdvDeliveryLayout } from "./pdv-delivery-layout";
import { PdvServiceLayout } from "./pdv-service-layout";
import { PdvPosLayout } from "./pdv-pos-layout";
export function PdvWorkMain() {
  const { page } = usePdv();
  return (
    <main className="work-main">
      {page === "delivery" ? (
        <PdvDeliveryLayout />
      ) : page === "servicos" ? (
        <PdvServiceLayout />
      ) : (
        <PdvPosLayout />
      )}
    </main>
  );
}

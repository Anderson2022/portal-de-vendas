import { PdvWorkPanelServiceMain } from "./pdv-work-panel-service-main";
import { PdvServiceCheckout } from "./pdv-service-checkout";
export function PdvServiceLayout() {
  return (
    <div className="service-layout">
      <PdvWorkPanelServiceMain />
      <PdvServiceCheckout />
    </div>
  );
}

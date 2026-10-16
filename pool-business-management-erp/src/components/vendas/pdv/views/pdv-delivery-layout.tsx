import { PdvWorkPanelDeliveryLeft } from "./pdv-work-panel-delivery-left";
import { PdvDeliveryCheckout } from "./pdv-delivery-checkout";
export function PdvDeliveryLayout() {
  return (
    <div className="delivery-layout">
      <PdvWorkPanelDeliveryLeft />
      <PdvDeliveryCheckout />
    </div>
  );
}

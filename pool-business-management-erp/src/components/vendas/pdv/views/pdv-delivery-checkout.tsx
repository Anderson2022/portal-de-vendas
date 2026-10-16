import { usePdv } from "../pdv-context";
import { PdvDeliveryOrderDetail } from "./pdv-delivery-order-detail";
import { PdvDeliveryCheckoutForm } from "./pdv-delivery-checkout-form";
export function PdvDeliveryCheckout() {
  const { deliveryTab } = usePdv();
  return (
    <aside className="work-panel checkout delivery-checkout">
      {deliveryTab === "orders" ? (
        <PdvDeliveryOrderDetail />
      ) : (
        <PdvDeliveryCheckoutForm />
      )}
    </aside>
  );
}

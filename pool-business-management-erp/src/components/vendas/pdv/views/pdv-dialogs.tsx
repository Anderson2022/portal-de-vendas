import { usePdv } from "../pdv-context";
import { X } from "lucide-react";

import { PdvShortcutsDialogContent } from "../dialogs/pdv-shortcuts-dialog-content";
import { PdvPaymentDialogContent } from "../dialogs/pdv-payment-dialog-content";
import { PdvCustomerDialogContent } from "../dialogs/pdv-customer-dialog-content";
import { PdvDiscountDialogContent } from "../dialogs/pdv-discount-dialog-content";
import { PdvBookingDialogContent } from "../dialogs/pdv-booking-dialog-content";
import { PdvSettingsDialogContent } from "../dialogs/pdv-settings-dialog-content";
export function PdvDialogs() {
  const { modal, setModal } = usePdv();
  return (
    <div
      className={`modal ${modal === "payment" ? "payment-modal" : ""}`}
      role="dialog"
      aria-modal="true"
    >
      <button className="modal-close" onClick={() => setModal(null)}>
        <X size={22} />
      </button>
      {modal === "shortcuts" ? (
        <PdvShortcutsDialogContent />
      ) : modal === "payment" ? (
        <PdvPaymentDialogContent />
      ) : modal === "customer" ? (
        <PdvCustomerDialogContent />
      ) : modal === "discount" ? (
        <PdvDiscountDialogContent />
      ) : modal === "booking" ? (
        <PdvBookingDialogContent />
      ) : (
        <PdvSettingsDialogContent />
      )}
    </div>
  );
}

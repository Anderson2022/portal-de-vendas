import { usePdv } from "./pdv-context";
import { PdvHomeView } from "./views/pdv-home-view";
import { PdvWorkView } from "./views/pdv-work-view";
import { CheckCircle2, X } from "lucide-react";
import { PdvModalOverlay } from "./views/pdv-modal-overlay";
export function PdvWorkspace() {
  const { page, modal, toast, setToast } = usePdv();
  return (
    <div className={`app ${page === "home" ? "is-home" : "is-work"}`}>
      {page === "home" ? <PdvHomeView /> : <PdvWorkView />}
      {modal && <PdvModalOverlay />}
      {toast && (
        <div role="status" className="toast">
          <CheckCircle2 size={19} />
          {toast}
          <button onClick={() => setToast("")}>
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

import { usePdv } from "../pdv-context";
import { PdvDialogs } from "./pdv-dialogs";
export function PdvModalOverlay() {
  const { setModal } = usePdv();
  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setModal(null);
      }}
    >
      <PdvDialogs />
    </div>
  );
}

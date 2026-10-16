import { usePdv } from "../pdv-context";
import { Settings } from "lucide-react";

export function PdvSettingsDialogContent() {
  const { setModal, printing, setPrinting, whatsapp, setWhatsapp } = usePdv();
  return (
    <>
      <h2>
        <Settings size={24} /> Configurações rápidas
      </h2>
      <p>Preferências do caixa e do sistema.</p>
      <label className="toggle-row">
        Impressão de comprovantes{" "}
        <input
          type="checkbox"
          checked={printing}
          onChange={(e) => setPrinting(e.target.checked)}
        />
      </label>
      <label className="toggle-row">
        Notificação por WhatsApp{" "}
        <input
          type="checkbox"
          checked={whatsapp}
          onChange={(e) => setWhatsapp(e.target.checked)}
        />
      </label>
      <div className="modal-footer">
        <button className="primary-btn" onClick={() => setModal(null)}>
          Salvar
        </button>
      </div>
    </>
  );
}

import { usePdv } from "../pdv-context";
import { CalendarDays } from "lucide-react";

import { staff } from "../constants/staff";
export function PdvBookingDialogContent() {
  const { setModal, message } = usePdv();
  return (
    <>
      <h2>
        <CalendarDays size={24} /> Novo agendamento
      </h2>
      <p>Agende um atendimento na agenda demonstrativa.</p>
      <label className="modal-field">
        Cliente
        <input placeholder="Nome do cliente" />
      </label>
      <label className="modal-field">
        Profissional
        <select defaultValue="Ana">
          {staff.map((s) => (
            <option key={s.name}>{s.name}</option>
          ))}
        </select>
      </label>
      <label className="modal-field">
        Data e hora
        <input type="datetime-local" />
      </label>
      <div className="modal-footer">
        <button onClick={() => setModal(null)}>Cancelar</button>
        <button
          className="primary-btn"
          onClick={() => {
            setModal(null);
            message("Agendamento criado (demonstração).");
          }}
        >
          Agendar
        </button>
      </div>
    </>
  );
}

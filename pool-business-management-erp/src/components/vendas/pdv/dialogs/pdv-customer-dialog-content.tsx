import { usePdv } from "../pdv-context";
import { UserPlus, UserRound, ChevronRight, Check } from "lucide-react";

export function PdvCustomerDialogContent() {
  const {
    setModal,
    message,
    clientInput,
    setClientInput,
    newClients,
    setClient,
    setNewClients,
  } = usePdv();
  return (
    <>
      <h2>
        <UserPlus size={24} /> Identificar cliente
      </h2>
      <p>Associe um cliente à venda atual.</p>
      <label className="modal-field">
        Nome do cliente
        <input
          autoFocus
          placeholder="Nome completo"
          value={clientInput}
          onChange={(e) => setClientInput(e.target.value)}
        />
      </label>
      <div className="suggested-customers">
        {["João da Silva", "Maria Oliveira", "Carlos Oliveira", ...newClients]
          .filter((c) => c.toLowerCase().includes(clientInput.toLowerCase()))
          .map((c) => (
            <button
              key={c}
              onClick={() => {
                setClient(c);
                setModal(null);
                message(`Cliente ${c} selecionado`);
              }}
            >
              <UserRound size={16} />
              {c}
              <ChevronRight size={14} />
            </button>
          ))}
      </div>
      <div className="modal-footer">
        <button onClick={() => setModal(null)}>Cancelar</button>
        <button
          className="primary-btn"
          onClick={() => {
            if (!clientInput.trim()) {
              message("Informe o nome do cliente.");
              return;
            }
            setClient(clientInput);
            setNewClients((prev) => [...prev, clientInput]);
            setClientInput("");
            setModal(null);
            message("Cliente adicionado à venda.");
          }}
        >
          <Check size={16} /> Salvar cliente
        </button>
      </div>
    </>
  );
}

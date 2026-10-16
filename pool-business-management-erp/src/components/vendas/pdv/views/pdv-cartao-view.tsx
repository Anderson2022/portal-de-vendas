import { usePdv } from "../pdv-context";
import { CreditCard, Users, UserRound } from "lucide-react";
export function PdvCartaoView() {
  const {
    message,
    client,
    setModal,
    payCardSaved,
    setPayCardSaved,
    useCredit,
    setUseCredit,
    startPayment,
  } = usePdv();
  return (
    <>
      <div className="card-tabs">
        <button className="active">
          <CreditCard size={17} /> Novo cartão
        </button>
        <button
          onClick={() =>
            message("Nenhum cartão cadastrado nesta demonstração.")
          }
        >
          <Users size={17} /> Cartões registrados
        </button>
      </div>
      <div className="card-reader">
        <CreditCard size={32} />
        <input
          placeholder="Passe, insira ou digite o cartão..."
          onKeyDown={(e) =>
            e.key === "Enter" && message("Cartão de demonstração identificado.")
          }
        />
      </div>
      <div className="identified-customer">
        <span className="customer-avatar">
          <UserRound />
        </span>
        <span>
          <small>Cliente identificado</small>
          <strong>{client || "João da Silva"}</strong>
          <small>**** **** **** 1234</small>
        </span>
        <button onClick={() => setModal("customer")}>Trocar cliente</button>
      </div>
      <h3>Informações do cartão</h3>
      <div className="card-info-grid">
        <label>
          Número do cartão
          <input value="**** **** **** 1234" readOnly />
        </label>
        <label>
          Tipo
          <input value="VISA" readOnly />
        </label>
        <label>
          Titular
          <input value={client || "João da Silva"} readOnly />
        </label>
        <label>
          Validade
          <input value="05/28" readOnly />
        </label>
        <label>
          Limite disponível
          <input value="R$ 500,00" readOnly />
        </label>
      </div>
      <label className="toggle-row">
        Salvar cartão para próximas vendas
        <input
          type="checkbox"
          checked={payCardSaved}
          onChange={(e) => setPayCardSaved(e.target.checked)}
        />
      </label>
      <label className="toggle-row">
        Usar crédito do cliente <small>Crédito disponível: R$ 120,00</small>
        <input
          type="checkbox"
          checked={useCredit}
          onChange={(e) => setUseCredit(e.target.checked)}
        />
      </label>
      <div className="checkout-spacer" />
      <button className="primary-btn" onClick={startPayment}>
        <CreditCard size={19} /> Confirmar e finalizar (F3)
      </button>
    </>
  );
}

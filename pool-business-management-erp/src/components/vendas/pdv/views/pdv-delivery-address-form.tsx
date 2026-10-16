import { usePdv } from "../pdv-context";
export function PdvDeliveryAddressForm() {
  const { message, address, setAddress } = usePdv();
  return (
    <>
      <div className="mini-tabs">
        <button className="active">Endereço de entrega</button>
        <button
          onClick={() => message("Nenhum endereço salvo para este cliente.")}
        >
          Endereço salvo
        </button>
      </div>
      <div className="address-grid">
        <label>
          CEP
          <input
            placeholder="00000-000"
            value={address.cep}
            onChange={(e) =>
              setAddress({
                ...address,
                cep: e.target.value,
              })
            }
          />
        </label>
        <label className="address-wide">
          Endereço
          <input
            placeholder="Digite o endereço completo..."
            value={address.street}
            onChange={(e) =>
              setAddress({
                ...address,
                street: e.target.value,
              })
            }
          />
        </label>
        <label>
          Número
          <input
            placeholder="Nº"
            value={address.number}
            onChange={(e) =>
              setAddress({
                ...address,
                number: e.target.value,
              })
            }
          />
        </label>
        <label className="address-wide">
          Bairro
          <input
            placeholder="Bairro"
            value={address.bairro}
            onChange={(e) =>
              setAddress({
                ...address,
                bairro: e.target.value,
              })
            }
          />
        </label>
        <label className="address-full">
          Ponto de referência (opcional)
          <input
            placeholder="Ex: Em frente ao mercado..."
            value={address.reference}
            onChange={(e) =>
              setAddress({
                ...address,
                reference: e.target.value,
              })
            }
          />
        </label>
      </div>
    </>
  );
}

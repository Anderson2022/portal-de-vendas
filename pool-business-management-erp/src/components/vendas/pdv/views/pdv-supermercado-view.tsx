import { usePdv } from "../pdv-context";
import { Barcode, X, UserRound, Percent, CreditCard } from "lucide-react";
import { QtyControl } from "../shared/qty-control";
import { money } from "../utils/money";
import { IconButton } from "../shared/icon-button";
export function PdvSupermercadoView() {
  const {
    scan,
    setScan,
    scanProduct,
    table,
    lineItems,
    updateQty,
    currentCart,
    subtotal,
    discount,
    total,
    setModal,
    startPayment,
  } = usePdv();
  return (
    <>
      <div className="market-scan">
        <Barcode size={23} />
        <input
          placeholder="Passe o produto no leitor ou digite o código..."
          value={scan}
          onChange={(e) => setScan(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && scanProduct()}
        />
        <kbd>F2</kbd>
      </div>
      <div className="table-scroll">
        <table className="data-table item-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Código</th>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Unitário</th>
              <th>Total</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {lineItems.map(({ item, product }, i) => (
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td>{product.barcode}</td>
                <td>{product.name}</td>
                <td>
                  <QtyControl
                    qty={item.qty}
                    onMinus={() => updateQty(item.id, -1)}
                    onPlus={() => updateQty(item.id, 1)}
                  />
                </td>
                <td>{money(product.price)}</td>
                <td>
                  <b>{money(item.qty * product.price)}</b>
                </td>
                <td>
                  <IconButton
                    icon={X}
                    onClick={() => updateQty(item.id, -item.qty)}
                    label="Remover"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="market-summary">
        <span>
          Itens <b>{lineItems.length}</b>
        </span>
        <span>
          Qtd total <b>{currentCart.reduce((sum, i) => sum + i.qty, 0)}</b>
        </span>
        <span>
          Subtotal <b>{money(subtotal)}</b>
        </span>
        <span>
          Desconto <b>- {money(discount)}</b>
        </span>
        <span>
          Total <strong>{money(total)}</strong>
        </span>
      </div>
      <div className="market-footer">
        <button onClick={() => setModal("customer")}>
          <UserRound size={15} /> Cliente
        </button>
        <button onClick={() => setModal("discount")}>
          <Percent size={15} /> Desconto
        </button>
        <button className="primary-btn" onClick={startPayment}>
          <CreditCard size={17} /> Finalizar venda
        </button>
      </div>
    </>
  );
}

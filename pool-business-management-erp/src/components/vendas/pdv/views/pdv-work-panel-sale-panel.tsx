import Image from "next/image";
import { usePdv } from "../pdv-context";
import { Trash2, Barcode, UserRound, Pencil, CreditCard } from "lucide-react";
import { QtyControl } from "../shared/qty-control";
import { money } from "../utils/money";
import { IconButton } from "../shared/icon-button";
import { Empty } from "../shared/empty";
export function PdvWorkPanelSalePanel() {
  const {
    clearCart,
    scannerRef,
    scan,
    setScan,
    scanProduct,
    lineItems,
    category,
    updateQty,
    setModal,
    client,
    message,
    subtotal,
    discount,
    total,
    startPayment,
  } = usePdv();
  return (
    <section className="work-panel sale-panel">
      <div className="panel-title">
        <h2>Venda atual</h2>
        <button className="danger-text" onClick={clearCart}>
          <Trash2 size={17} /> Limpar
        </button>
      </div>
      <div className="scan-input">
        <Barcode size={20} />
        <input
          ref={scannerRef}
          placeholder="Scanner ou código do produto..."
          value={scan}
          onChange={(e) => setScan(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && scanProduct()}
        />
        <kbd>F2</kbd>
      </div>
      <div className="sale-items">
        {lineItems.length ? (
          lineItems.map(({ item, product }) => (
            <div key={item.id} className="sale-item">
              <Image
                unoptimized
                src={product.image}
                alt={product.name}
                width={160}
                height={160}
              />
              <span className="sale-item-name">
                <b>{product.name}</b>
                <small>{product.barcode || product.category}</small>
              </span>
              <QtyControl
                qty={item.qty}
                onMinus={() => updateQty(item.id, -1)}
                onPlus={() => updateQty(item.id, 1)}
              />
              <span className="sale-item-price">
                <b>{money(product.price * item.qty)}</b>
                <small>{money(product.price)} un.</small>
              </span>
              <IconButton
                icon={Trash2}
                label="Remover item"
                onClick={() => updateQty(item.id, -item.qty)}
              />
            </div>
          ))
        ) : (
          <Empty
            title="Nenhum produto na venda"
            desc="Clique em um produto ou use o scanner."
          />
        )}
      </div>
      <div className="sale-bottom">
        <div className="sale-tools">
          <button onClick={() => setModal("customer")}>
            <UserRound size={15} /> {client || "Cliente (F4)"}
          </button>
          <button onClick={() => message("Observação adicionada (simulação).")}>
            <Pencil size={15} /> Observação
          </button>
          <button onClick={clearCart}>
            <Trash2 size={15} /> Limpar
          </button>
        </div>
        <div className="sale-summary">
          <p>
            Subtotal <b>{money(subtotal)}</b>
          </p>
          <p>
            Desconto{" "}
            <button onClick={() => setModal("discount")}>
              {discount ? `- ${money(discount)}` : "- R$ 0,00"}{" "}
              <Pencil size={12} />
            </button>
          </p>
          <div className="sale-total">
            Total <strong>{money(total)}</strong>
          </div>
        </div>
        <button className="primary-btn" onClick={startPayment}>
          <CreditCard size={20} /> Finalizar venda (F3)
        </button>
      </div>
    </section>
  );
}

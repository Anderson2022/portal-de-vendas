import Image from "next/image";
import { usePdv } from "../pdv-context";
import {
  UtensilsCrossed,
  Plus,
  RefreshCw,
  Printer,
  LockKeyhole,
} from "lucide-react";
import { money } from "../utils/money";
import { foodProducts } from "../constants/food-products";
import { QtyControl } from "../shared/qty-control";
import { Empty } from "../shared/empty";
export function PdvTablesWork() {
  const {
    setTable,
    setCategory,
    tableCarts,
    table,
    lineItems,
    updateQty,
    subtotal,
    message,
    startPayment,
  } = usePdv();
  return (
    <div className="tables-work">
      <div className="tables-grid">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => {
              setTable(n);
              setCategory("Todos");
            }}
            className={`table-card ${(tableCarts[n] || []).length ? "occupied" : "free"} ${table === n ? "chosen" : ""}`}
          >
            <UtensilsCrossed size={24} />
            <strong>Mesa {String(n).padStart(2, "0")}</strong>
            <small>
              {(tableCarts[n] || []).length ? "2 pessoas" : "Livre"}
            </small>
            {(tableCarts[n] || []).length > 0 && (
              <b>
                {money(
                  (tableCarts[n] || []).reduce(
                    (s, it) =>
                      s +
                      it.qty *
                        (foodProducts.find((p) => p.id === it.id)?.price || 0),
                    0,
                  ),
                )}
              </b>
            )}
          </button>
        ))}
      </div>
      <div className="table-detail">
        <h3>Mesa {String(table).padStart(2, "0")}</h3>
        <small>{lineItems.length ? "2 pessoas" : "Disponível"}</small>
        <div className="table-detail-items">
          {lineItems.length ? (
            lineItems.map(({ item, product }) => (
              <div key={item.id}>
                <Image
                  unoptimized
                  src={product.image}
                  alt={product.name}
                  width={160}
                  height={160}
                />
                <span>{product.name}</span>
                <QtyControl
                  qty={item.qty}
                  onMinus={() => updateQty(item.id, -1)}
                  onPlus={() => updateQty(item.id, 1)}
                />
                <b>{money(item.qty * product.price)}</b>
              </div>
            ))
          ) : (
            <Empty title="Mesa livre" />
          )}
        </div>
        <p>
          Subtotal <b>{money(subtotal)}</b>
        </p>
        <p>
          Taxa de serviço (10%) <b>{money(subtotal * 0.1)}</b>
        </p>
        <p className="table-grand">
          Total <b>{money(subtotal * 1.1)}</b>
        </p>
        <button onClick={() => setCategory("Pizzas")}>
          <Plus size={15} /> Adicionar item
        </button>
        <button
          onClick={() =>
            message("Transferência de mesa disponível em integração futura.")
          }
        >
          <RefreshCw size={15} /> Transferir mesa
        </button>
        <button
          onClick={() => message("Comanda enviada à impressora (simulação).")}
        >
          <Printer size={15} /> Imprimir comanda
        </button>
        <button className="primary-btn" onClick={startPayment}>
          <LockKeyhole size={15} /> Finalizar conta
        </button>
      </div>
    </div>
  );
}

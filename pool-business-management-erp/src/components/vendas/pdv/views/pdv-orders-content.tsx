import { usePdv } from "../pdv-context";
import { Chip } from "../shared/chip";
import { Search, Phone, MapPin, ChevronRight } from "lucide-react";
import { money } from "../utils/money";
export function PdvOrdersContent() {
  const {
    statuses,
    orderFilter,
    setOrderFilter,
    orders,
    search,
    setSearch,
    selectedOrder,
    setSelectedOrder,
    address,
    total,
  } = usePdv();
  return (
    <div className="orders-content">
      <div className="order-filter-row">
        {["Todos", ...statuses].map((s) => (
          <Chip
            key={s}
            active={orderFilter === s}
            onClick={() => setOrderFilter(s)}
          >
            {s === "Todos" ? `Todos (${orders.length})` : s}
          </Chip>
        ))}
      </div>
      <div className="orders-search">
        <Search size={16} />
        <input
          placeholder="Buscar pedido, cliente ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {statuses
        .filter((s) => orderFilter === "Todos" || orderFilter === s)
        .map((status) => {
          const group = orders.filter(
            (o) =>
              o.status === status &&
              `${o.customer} ${o.id} ${o.phone}`
                .toLowerCase()
                .includes(search.toLowerCase()),
          );
          return (
            group.length > 0 && (
              <div
                key={status}
                className={`order-group status-${status.replaceAll(" ", "-")}`}
              >
                <h3>
                  <span>●</span>
                  {status} ({group.length})
                </h3>
                {group.map((o) => (
                  <button
                    key={o.id}
                    className={`order-line ${selectedOrder === o.id ? "selected" : ""}`}
                    onClick={() => setSelectedOrder(o.id)}
                  >
                    <strong>#{o.id}</strong>
                    <span className="order-person">
                      <b>{o.customer}</b>
                      <small>
                        <Phone size={11} />
                        {o.phone}
                      </small>
                      <small>
                        <MapPin size={11} />
                        {o.address}
                      </small>
                    </span>
                    <span className="order-payment">{o.payment}</span>
                    <b>{money(o.total)}</b>
                    <span className="order-pill">{o.status}</span>
                    <span className="order-detail-button">
                      Ver detalhes <ChevronRight size={14} />
                    </span>
                  </button>
                ))}
              </div>
            )
          );
        })}
    </div>
  );
}

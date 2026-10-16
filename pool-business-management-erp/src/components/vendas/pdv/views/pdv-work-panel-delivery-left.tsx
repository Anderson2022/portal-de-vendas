import { usePdv } from "../pdv-context";
import { LayoutDashboard, List } from "lucide-react";
import { CatalogHeader } from "../shared/catalog-header";
import { ProductCard } from "../shared/product-card";
import { PdvOrdersContent } from "./pdv-orders-content";
export function PdvWorkPanelDeliveryLeft() {
  const {
    deliveryTab,
    setDeliveryTab,
    orders,
    category,
    setCategory,
    search,
    setSearch,
    scannerRef,
    visible,
    updateQty,
    message,
  } = usePdv();
  return (
    <section className="work-panel delivery-left">
      <div className="segment">
        <button
          className={deliveryTab === "products" ? "active" : ""}
          onClick={() => setDeliveryTab("products")}
        >
          <LayoutDashboard size={17} /> Produtos
        </button>
        <button
          className={deliveryTab === "orders" ? "active" : ""}
          onClick={() => setDeliveryTab("orders")}
        >
          <List size={17} /> Pedidos{" "}
          <span className="tiny-count">{orders.length}</span>
        </button>
      </div>
      {deliveryTab === "products" ? (
        <>
          <CatalogHeader
            categories={[
              "Todos",
              "Pizzas",
              "Lanches",
              "Bebidas",
              "Porções",
              "Sobremesas",
              "Combos",
            ]}
            category={category}
            setCategory={setCategory}
            search={search}
            setSearch={setSearch}
            scannerRef={scannerRef}
          />
          <div className="catalog-grid food-grid">
            {visible.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={() => {
                  updateQty(p.id, 1);
                  message(`${p.name} adicionado ao pedido`);
                }}
                food
              />
            ))}
          </div>
        </>
      ) : (
        <PdvOrdersContent />
      )}
    </section>
  );
}

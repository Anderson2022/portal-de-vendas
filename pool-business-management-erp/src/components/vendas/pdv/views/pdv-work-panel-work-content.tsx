import { usePdv } from "../pdv-context";
import { CatalogHeader } from "../shared/catalog-header";
import { ProductCard } from "../shared/product-card";
import { PdvSupermercadoView } from "./pdv-supermercado-view";
import { PdvCartaoView } from "./pdv-cartao-view";
import { PdvMesasView } from "./pdv-mesas-view";
export function PdvWorkPanelWorkContent() {
  const { page, category, setCategory, search, setSearch, visible, updateQty } =
    usePdv();
  return (
    <section className="work-panel work-content">
      {page === "lancamento" ? (
        <>
          <CatalogHeader
            categories={["Todos", "Bebidas", "Alimentos", "Limpeza", "Higiene"]}
            category={category}
            setCategory={setCategory}
            search={search}
            setSearch={setSearch}
          />
          <div className="catalog-grid market-grid">
            {visible.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={() => updateQty(p.id, 1)}
              />
            ))}
          </div>
        </>
      ) : page === "supermercado" ? (
        <PdvSupermercadoView />
      ) : page === "cartao" ? (
        <PdvCartaoView />
      ) : page === "mesas" ? (
        <PdvMesasView />
      ) : null}
    </section>
  );
}

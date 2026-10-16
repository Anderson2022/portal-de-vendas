import Image from "next/image";
import { usePdv } from "../pdv-context";
import { Chip } from "../shared/chip";
import { PdvTablesWork } from "./pdv-tables-work";
import { foodProducts } from "../constants/food-products";
import { money } from "../utils/money";
import { Plus } from "lucide-react";
export function PdvMesasView() {
  const { navigate, message, table, updateQty, category } = usePdv();
  return (
    <>
      <div className="tables-top">
        <div className="small-segment">
          <button className="active">Mesas</button>
          <button onClick={() => navigate("pedidos")}>Pedidos</button>
          <button
            onClick={() => message("Comandas disponíveis na opção Mesas.")}
          >
            Comandas
          </button>
        </div>
        <div className="table-filter">
          <Chip active onClick={() => {}}>
            Todas (12)
          </Chip>
          <Chip
            onClick={() => message("Mostrando as mesas ocupadas em destaque.")}
          >
            Ocupadas
          </Chip>
          <Chip onClick={() => message("Mesas livres em verde.")}>Livres</Chip>
        </div>
      </div>
      <PdvTablesWork />
      <div className="table-catalog">
        <div className="section-caption">
          <h3>Adicionar produtos à mesa</h3>
          <span>Mesa {String(table).padStart(2, "0")}</span>
        </div>
        <div className="small-catalog">
          {foodProducts
            .slice(0, 10)
            .filter((p) => category === "Todos" || p.category === category)
            .map((p) => (
              <button key={p.id} onClick={() => updateQty(p.id, 1)}>
                <Image src={p.image} alt={p.name} width={160} height={160} />
                <span>
                  <b>{p.name}</b>
                  <small>{money(p.price)}</small>
                </span>
                <Plus size={17} />
              </button>
            ))}
        </div>
      </div>
    </>
  );
}

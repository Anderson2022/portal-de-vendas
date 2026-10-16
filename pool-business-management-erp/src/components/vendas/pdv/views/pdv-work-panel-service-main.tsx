import { usePdv } from "../pdv-context";
import { Scissors, Plus, CalendarDays } from "lucide-react";
import { CatalogHeader } from "../shared/catalog-header";
import { ProductCard } from "../shared/product-card";
import { staff } from "../constants/staff";
export function PdvWorkPanelServiceMain() {
  const {
    category,
    setCategory,
    search,
    setSearch,
    scannerRef,
    visible,
    updateQty,
    setModal,
    selectedStaff,
    setSelectedStaff,
    message,
  } = usePdv();
  return (
    <section className="work-panel service-main">
      <div className="section-title">
        <span className="section-icon">
          <Scissors size={27} />
        </span>
        <h1>Serviços</h1>
      </div>
      <CatalogHeader
        categories={[
          "Todos",
          "Cabeleireiro",
          "Barbearia",
          "Estética",
          "Manicure",
          "Pedicure",
          "Depilação",
          "Massagem",
        ]}
        category={category}
        setCategory={setCategory}
        search={search}
        setSearch={setSearch}
        scannerRef={scannerRef}
      />
      <div className="section-caption">
        <h3>Serviços</h3>
        <span>{visible.length} disponíveis</span>
      </div>
      <div className="catalog-grid service-grid">
        {visible.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onAdd={() => updateQty(p.id, 1)}
            service
          />
        ))}
      </div>
      <div className="section-caption">
        <h3>Profissionais</h3>
        <button onClick={() => setModal("booking")}>
          <Plus size={15} /> Agendar serviço
        </button>
      </div>
      <div className="staff-grid">
        <button
          className={`staff-card ${selectedStaff === "Todos" ? "active" : ""}`}
          onClick={() => setSelectedStaff("Todos")}
        >
          <span className="staff-emoji">👥</span>
          <b>Todos</b>
        </button>
        {staff.map((s) => (
          <button
            className={`staff-card ${selectedStaff === s.name ? "active" : ""}`}
            key={s.name}
            onClick={() => setSelectedStaff(s.name)}
          >
            <span className="staff-emoji" style={{ background: s.color }}>
              {s.emoji}
            </span>
            <span className="staff-online" />
            <b>{s.name}</b>
            <small>{s.role}</small>
          </button>
        ))}
      </div>
      <div className="section-caption agenda-header">
        <h3>Agenda do dia</h3>
        <span className="agenda-date">
          <CalendarDays size={15} /> {new Date().toLocaleDateString("pt-BR")}
        </span>
        <button onClick={() => setModal("booking")}>
          <Plus size={15} /> Novo agendamento
        </button>
      </div>
      <div className="agenda">
        <div className="agenda-hours">
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i}>{String(i + 8).padStart(2, "0")}:00</span>
          ))}
        </div>
        <div className="agenda-slots">
          {[
            {
              name: "Ana",
              service: "Corte Feminino",
              time: "09:00 - 10:00",
              start: 1,
              tone: "blue",
            },
            {
              name: "Carlos",
              service: "Barba",
              time: "10:00 - 10:30",
              start: 2,
              tone: "green",
            },
            {
              name: "Mariana",
              service: "Limpeza de Pele",
              time: "11:00 - 12:30",
              start: 3,
              tone: "pink",
            },
            {
              name: "João",
              service: "Manicure",
              time: "13:00 - 14:00",
              start: 5,
              tone: "amber",
            },
            {
              name: "Fernanda",
              service: "Massagem",
              time: "15:00 - 16:00",
              start: 7,
              tone: "purple",
            },
          ]
            .filter(
              (e) => selectedStaff === "Todos" || e.name === selectedStaff,
            )
            .map((e) => (
              <button
                key={e.name}
                style={{ gridColumn: `${e.start + 1}/span 1` }}
                className={`agenda-event agenda-${e.tone}`}
                onClick={() => message(`${e.name} • ${e.service} • ${e.time}`)}
              >
                <b>{e.name}</b>
                <small>{e.service}</small>
                <small>{e.time}</small>
              </button>
            ))}
        </div>
      </div>
    </section>
  );
}

import { useUtility } from "./utility-context";
import {
  House,
  ChevronRight,
  Plus,
  Bike,
  Store,
  CreditCard,
  Printer,
  LockKeyhole,
  Bell,
} from "lucide-react";
import { Chip } from "../shared/chip";
import type { LucideIcon } from "lucide-react";
import { PdvUtilityCard } from "../views/pdv-utility-card";
export function UtilityContent() {
  const {
    navigate,
    pageTitle,
    labels,
    page,
    setModal,
    message,
    metrics,
    dataFilter,
    setDataFilter,
  } = useUtility();
  return (
    <main className="utility-main">
      <div className="utility-breadcrumb">
        <button onClick={() => navigate("home")}>
          <House size={17} /> Início
        </button>
        <ChevronRight size={15} />
        {pageTitle}
      </div>
      <div className="utility-heading">
        <div>
          <h1>{pageTitle}</h1>
          <p>{labels[page]}</p>
        </div>
        <button
          className="primary-btn"
          onClick={() => {
            if (page === "clientes") setModal("customer");
            else if (page === "configuracoes") setModal("settings");
            else
              message(
                `Ação de cadastro de ${pageTitle.toLowerCase()} disponível com API.`,
              );
          }}
        >
          <Plus size={17} />{" "}
          {page === "relatorios"
            ? "Novo relatório"
            : page === "entregas"
              ? "Novo entregador"
              : page === "configuracoes"
                ? "Editar preferências"
                : `Novo ${page === "produtos" ? "produto" : page === "pedidos" ? "pedido" : "registro"}`}
        </button>
      </div>
      {metrics && (
        <div className="metric-grid">
          {metrics.map(([title, value, extra, Icon]) => (
            <div className="metric" key={title as string}>
              <span>{title as string}</span>
              <Icon size={22} />
              <strong>{value as string}</strong>
              <small>{extra as string}</small>
            </div>
          ))}
        </div>
      )}
      {page === "relatorios" && (
        <div className="analytics-card">
          <div className="section-caption">
            <h2>Visão geral de vendas</h2>
            <div className="filter-buttons">
              {["Hoje", "7 dias", "30 dias", "Este ano"].map((s) => (
                <Chip
                  key={s}
                  active={s === dataFilter}
                  onClick={() => setDataFilter(s)}
                >
                  {s}
                </Chip>
              ))}
            </div>
          </div>
          <div className="demo-chart">
            {[42, 64, 50, 75, 62, 89, 58, 78, 94, 66, 82, 100].map((n, i) => (
              <div key={i} className="chart-column">
                <span style={{ height: `${n}%` }} />
                <small>{String(i + 1).padStart(2, "0")}:00</small>
              </div>
            ))}
          </div>
          <div className="chart-footer">
            <span>
              Receita de vendas <b>R$ 8.492,50</b>
            </span>
            <span>
              Vendas aprovadas <b>148</b>
            </span>
            <span>
              Conversão <b>87,6%</b>
            </span>
          </div>
        </div>
      )}
      {page === "entregas" && (
        <div className="delivery-monitor">
          <div className="demo-map">
            <div className="map-streets" />
            <span className="map-marker marker-one">
              <Bike size={19} /> Lucas
            </span>
            <span className="map-marker marker-two">
              <Bike size={19} /> Rafael
            </span>
            <span className="map-marker marker-three">
              <Bike size={19} /> Marcos
            </span>
            <div className="map-warning">
              Mapa demonstrativo — GPS em tempo real requer integração.
            </div>
          </div>
          <div className="driver-list">
            <h3>Entregadores em operação</h3>
            {[
              ["Lucas Mendes", "Em rota", "Pedido #1023"],
              ["Rafael Pereira", "Em rota", "Pedido #1022"],
              ["Marcos Costa", "Disponível", "Sem pedido"],
            ].map(([name, status, order]) => (
              <div key={name}>
                <span className="driver-avatar">
                  <Bike size={18} />
                </span>
                <span>
                  <strong>{name}</strong>
                  <small>{order}</small>
                </span>
                <span className="driver-status">{status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {page === "configuracoes" && (
        <div className="settings-grid">
          {(
            [
              [
                "Dados da loja",
                "Informações fiscais, endereço e funcionamento",
                Store,
              ],
              [
                "Formas de pagamento",
                "Cartões, PIX, dinheiro, taxas e parcelamento",
                CreditCard,
              ],
              ["Impressão", "Impressoras, recibos e cupons NFC-e", Printer],
              [
                "Caixa e operadores",
                "Abertura, fechamento e permissões",
                LockKeyhole,
              ],
              ["Delivery", "Bairros, taxas, motoboys e rotas", Bike],
              ["Notificações", "Avisos de vendas e novos pedidos", Bell],
            ] as [string, string, LucideIcon][]
          ).map(([name, desc, Icon]) => (
            <button key={name as string} onClick={() => setModal("settings")}>
              <span>
                <Icon size={24} />
              </span>
              <b>{name as string}</b>
              <small>{desc as string}</small>
              <ChevronRight size={18} />
            </button>
          ))}
        </div>
      )}
      {page !== "configuracoes" && page !== "entregas" && <PdvUtilityCard />}
    </main>
  );
}

import { useUtility } from "../utility/utility-context";
import {
  Search,
  Filter,
  Download,
  Package,
  CreditCard,
  Users,
  Eye,
} from "lucide-react";
import { Empty } from "../shared/empty";
export function PdvUtilityCard() {
  const {
    page,
    pageTitle,
    query,
    setQuery,
    setCheck,
    check,
    message,
    headers,
    dataRows,
  } = useUtility();
  return (
    <div className="utility-card">
      <div className="utility-card-top">
        <h2>{page === "relatorios" ? "Últimas movimentações" : pageTitle}</h2>
        <div>
          <label className="utility-search">
            <Search size={17} />
            <input
              placeholder="Buscar registros..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <button
            className="light-action"
            onClick={() => setCheck(check === "Todos" ? "Ativo" : "Todos")}
          >
            <Filter size={16} /> {check}
          </button>
          <button
            className="light-action"
            onClick={() =>
              message("Exportação disponível após conexão com a API.")
            }
          >
            <Download size={16} /> Exportar
          </button>
        </div>
      </div>
      {page === "relatorios" ? (
        <div className="report-cards">
          <button
            onClick={() => message("Detalhamento: Produtos mais vendidos")}
          >
            <Package />
            <b>Produtos mais vendidos</b>
            <small>Coca-Cola 2L · Leite · Arroz</small>
          </button>
          <button onClick={() => message("Detalhamento: Meios de pagamento")}>
            <CreditCard />
            <b>Meios de pagamento</b>
            <small>PIX 46% · Cartão 38% · Dinheiro 16%</small>
          </button>
          <button onClick={() => message("Detalhamento: Clientes ativos")}>
            <Users />
            <b>Clientes ativos</b>
            <small>216 clientes recorrentes</small>
          </button>
        </div>
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                {(headers[page] || []).map((h) => (
                  <th key={h}>{h}</th>
                ))}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {dataRows
                .filter(
                  (row) =>
                    row.join(" ").toLowerCase().includes(query.toLowerCase()) &&
                    (check === "Todos" || row.join(" ").includes(check)),
                )
                .map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, c) => (
                      <td key={c}>{c === 0 ? <b>{cell}</b> : cell}</td>
                    ))}
                    <td>
                      <button
                        className="row-view"
                        onClick={() =>
                          message(`Detalhes de ${row[0]} (demonstração).`)
                        }
                      >
                        <Eye size={16} /> Ver
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {dataRows.length === 0 && <Empty title="Sem registros" />}
        </div>
      )}
    </div>
  );
}

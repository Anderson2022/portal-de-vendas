package br.com.poolcontrol.financeiro.dimensoes;

import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Repository
@RequiredArgsConstructor
public class DimensionHistory {
    private final JdbcClient jdbc;
    private final CurrentUserService user;

    public void record(String table, Object id) {
        if (!Set.of("centros_custos", "filiais", "projetos_financeiros", "naturezas_financeiras").contains(table)) {
            throw new IllegalArgumentException("Cadastro inválido.");
        }
        jdbc.sql("INSERT INTO financial_dimension_history (empresa_id, dominio, registro_id, usuario_id, dados) "
                + "SELECT :company, :domain, :id, :actor, to_jsonb(t) FROM " + table
                + " t WHERE t.id::text = :id AND t.empresa_id = :company")
                .param("company", user.companyId()).param("domain", table).param("id", id.toString())
                .param("actor", user.userId()).update();
    }

    public List<Map<String, Object>> list(String table, Object id) {
        return jdbc.sql("""
                SELECT h.id, h.ocorrido_em AS "occurredAt", u.name AS "userName",
                       h.dados::text AS snapshot
                  FROM financial_dimension_history h JOIN users u ON u.id = h.usuario_id
                 WHERE h.empresa_id = :company AND h.dominio = :domain AND h.registro_id = :id
                 ORDER BY h.ocorrido_em DESC, h.id DESC
                """).param("company", user.companyId()).param("domain", table).param("id", id.toString())
                .query().listOfRows();
    }
}

package br.com.poolcontrol.financeiro.dimensoes;

import br.com.poolcontrol.shared.exception.BusinessException;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DimensionRules {
    private static final Set<String> TABLES = Set.of("centros_custos", "filiais", "projetos_financeiros",
            "naturezas_financeiras", "plano_contas", "users", "customers", "contas_bancarias", "fornecedores");
    private final JdbcClient jdbc;
    private final CurrentUserService user;

    public void lock() {
        jdbc.sql("SELECT pg_advisory_xact_lock(:company)").param("company", user.companyId()).query().listOfRows();
    }

    public void code(String value) {
        if (value == null || !value.equals(value.trim())) {
            throw new BusinessException("O código não pode conter espaços no início ou no fim.");
        }
    }

    public void choice(String value, String allowed) {
        if (!Arrays.asList(allowed.split(" ")).contains(value)) {
            throw new BusinessException("Tipo, grupo, movimento ou status inválido.");
        }
    }

    public void dates(LocalDate start, LocalDate end) {
        if (start != null && end != null && end.isBefore(start)) {
            throw new BusinessException("A data final não pode ser anterior à inicial.");
        }
    }

    public void reference(String table, Object id) {
        if (id == null) return;
        if (!TABLES.contains(table)) throw new IllegalArgumentException("Tabela inválida.");
        String deleted = Set.of("centros_custos", "plano_contas", "contas_bancarias").contains(table)
                ? " AND excluido_em IS NULL" : "";
        boolean exists = jdbc.sql("SELECT EXISTS (SELECT 1 FROM " + table
                + " WHERE id::text = :id AND empresa_id = :company" + deleted + ")")
                .param("id", id.toString()).param("company", user.companyId()).query(Boolean.class).single();
        if (!exists) throw new BusinessException("O vínculo selecionado não pertence à empresa ou não existe.");
    }

    public void entry(String table, Object id, LocalDate date) {
        if (id == null) return;
        reference(table, id);
        String conditions = "ativo";
        if (Set.of("centros_custos", "naturezas_financeiras", "plano_contas").contains(table)) {
            conditions += " AND aceita_lancamento";
        }
        if (Set.of("centros_custos", "naturezas_financeiras", "filiais").contains(table)) {
            conditions += " AND (data_inicio IS NULL OR data_inicio <= :date) AND (data_fim IS NULL OR data_fim >= :date)";
        }
        if ("projetos_financeiros".equals(table)) conditions += " AND status IN ('PLANEJADO', 'EM_ANDAMENTO')";
        boolean valid = jdbc.sql("SELECT " + conditions + " FROM " + table
                + " WHERE id::text = :id AND empresa_id = :company")
                .param("id", id.toString()).param("company", user.companyId()).param("date", date)
                .query(Boolean.class).single();
        if (!valid) throw new BusinessException("Cadastro inativo, fora da validade ou sem permissão para lançamentos.");
    }

    public void hierarchy(String table, String column, Object id, Object parent) {
        if (parent == null) return;
        reference(table, parent);
        if (id == null) return;
        if (!Set.of("centro_pai_id", "unidade_pai_id", "natureza_pai_id").contains(column)) {
            throw new IllegalArgumentException("Hierarquia inválida.");
        }
        boolean cycle = jdbc.sql("WITH RECURSIVE parents AS (SELECT id, " + column + " AS parent FROM "
                + table + " WHERE id::text = :parent AND empresa_id = :company UNION SELECT p.id, p." + column
                + " FROM " + table + " p JOIN parents a ON a.parent = p.id WHERE p.empresa_id = :company)"
                + " SELECT EXISTS (SELECT 1 FROM parents WHERE id::text = :id)")
                .param("parent", parent.toString()).param("id", id.toString()).param("company", user.companyId())
                .query(Boolean.class).single();
        if (cycle) throw new BusinessException("A hierarquia não pode conter ciclos.");
    }
}

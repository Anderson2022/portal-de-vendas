package br.com.poolcontrol.financeiro.dimensoes;

import br.com.poolcontrol.financeiro.centros.CostCenterRepository;
import br.com.poolcontrol.financeiro.unidades.UnitRepository;
import br.com.poolcontrol.financeiro.projetos.ProjectRepository;
import br.com.poolcontrol.financeiro.naturezas.FinancialNatureRepository;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/financeiro/dimensoes")
@PreAuthorize("hasAuthority('PERM_FINANCIAL_VIEW')")
@RequiredArgsConstructor
public class DimensionOptionsController {
    private final CostCenterRepository centers;
    private final UnitRepository units;
    private final ProjectRepository projects;
    private final FinancialNatureRepository natures;
    private final JdbcClient jdbc;
    private final CurrentUserService user;

    @GetMapping
    public Map<String, Object> options() {
        return Map.of(
                "centers", centers.list(), "units", units.list(), "projects", projects.list(), "natures", natures.list(),
                "accounts", jdbc.sql("""
                    SELECT id::text AS id, codigo AS code, nome AS name, ativo AS active,
                           aceita_lancamento AS "acceptsEntries", natureza_financeira_padrao_id AS "defaultNatureId"
                      FROM plano_contas WHERE empresa_id = :company AND excluido_em IS NULL ORDER BY codigo
                    """).param("company", user.companyId()).query().listOfRows(),
                "users", jdbc.sql("SELECT id::text AS id, name, active FROM users WHERE empresa_id = :company")
                        .param("company", user.companyId()).query().listOfRows(),
                "customers", jdbc.sql("SELECT id::text AS id, name FROM customers WHERE empresa_id = :company")
                        .param("company", user.companyId()).query().listOfRows(),
                "banks", jdbc.sql("""
                    SELECT id::text AS id, concat_ws(' / ', banco, agencia, conta) AS name
                      FROM contas_bancarias WHERE empresa_id = :company AND excluido_em IS NULL
                    """).param("company", user.companyId()).query().listOfRows(),
                "company", jdbc.sql("SELECT id::text AS id, trade_name AS name FROM empresas WHERE id = :company")
                        .param("company", user.companyId()).query().singleRow());
    }
}

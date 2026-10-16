package br.com.poolcontrol.financeiro.projetos.orcamento;

import br.com.poolcontrol.financeiro.dimensoes.DimensionRules;
import br.com.poolcontrol.shared.security.CurrentUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/financeiro/cadastros/projetos/{id}/orcamento")
@RequiredArgsConstructor
public class ProjectBudgetController {
    private final JdbcClient jdbc;
    private final CurrentUserService user;
    private final DimensionRules rules;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_VIEW')")
    public List<Map<String, Object>> list(@PathVariable Long id) {
        rules.reference("projetos_financeiros", id);
        return jdbc.sql("""
                SELECT o.id, o.plano_conta_id AS "chartAccountId", o.centro_custo_id AS "costCenterId",
                       c.nome AS "accountName", cc.nome AS "centerName", o.valor_orcado AS planned,
                       COALESCE(v.realized, 0) AS realized, COALESCE(v.committed, 0) AS committed
                  FROM projeto_orcamento o JOIN plano_contas c ON c.id = o.plano_conta_id
                  JOIN centros_custos cc ON cc.id = o.centro_custo_id
                  LEFT JOIN LATERAL (
                    SELECT SUM(CASE WHEN p.status = 'PAID' THEN COALESCE(r.valor, p.amount) ELSE 0 END) AS realized,
                           SUM(CASE WHEN p.status = 'PENDING' THEN COALESCE(r.valor, p.amount) ELSE 0 END) AS committed
                      FROM accounts_payable p
                      LEFT JOIN payable_rateios r ON r.lancamento_id = p.id AND r.centro_custo_id = o.centro_custo_id
                     WHERE p.empresa_id = :company AND p.projeto_id = :project AND p.plano_conta_id = o.plano_conta_id
                       AND (r.id IS NOT NULL OR (p.centro_custo_id = o.centro_custo_id AND NOT EXISTS (
                            SELECT 1 FROM payable_rateios all_r WHERE all_r.lancamento_id = p.id)))
                  ) v ON TRUE
                 WHERE o.empresa_id = :company AND o.projeto_id = :project ORDER BY c.codigo, cc.codigo
                """).param("company", user.companyId()).param("project", id).query().listOfRows();
    }

    @PutMapping
    @Transactional
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_CREATE')")
    @ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
    public void save(@PathVariable Long id, @Valid @RequestBody ProjectBudgetRequest request) {
        rules.lock();
        rules.reference("projetos_financeiros", id);
        rules.reference("plano_contas", request.chartAccountId());
        rules.reference("centros_custos", request.costCenterId());
        jdbc.sql("""
                INSERT INTO projeto_orcamento (id, empresa_id, projeto_id, plano_conta_id, centro_custo_id, valor_orcado)
                VALUES (:id, :company, :project, :account, :center, :planned)
                ON CONFLICT (empresa_id, projeto_id, plano_conta_id, centro_custo_id)
                DO UPDATE SET valor_orcado = EXCLUDED.valor_orcado
                """).param("id", UUID.randomUUID()).param("company", user.companyId()).param("project", id)
                .param("account", request.chartAccountId()).param("center", request.costCenterId())
                .param("planned", request.planned()).update();
    }
}

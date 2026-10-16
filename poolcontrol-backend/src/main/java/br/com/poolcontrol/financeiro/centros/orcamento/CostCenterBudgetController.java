package br.com.poolcontrol.financeiro.centros.orcamento;

import br.com.poolcontrol.financeiro.dimensoes.DimensionRules;
import br.com.poolcontrol.shared.exception.BusinessException;
import br.com.poolcontrol.shared.security.CurrentUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/financeiro/cadastros/centros-custo/{id}/orcamento")
@RequiredArgsConstructor
public class CostCenterBudgetController {
    private final JdbcClient jdbc;
    private final CurrentUserService user;
    private final DimensionRules rules;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_VIEW')")
    public List<Map<String, Object>> list(@PathVariable UUID id) {
        rules.reference("centros_custos", id);
        return jdbc.sql("""
                SELECT o.id, o.competencia AS period, o.valor_orcado AS planned, o.valor_revisado AS revised,
                       o.observacao AS notes, COALESCE(v.realized, 0) AS realized, COALESCE(v.committed, 0) AS committed
                  FROM centro_custo_orcamento o
                  LEFT JOIN LATERAL (
                    SELECT SUM(CASE WHEN p.status = 'PAID' THEN COALESCE(r.valor, p.amount) ELSE 0 END) AS realized,
                           SUM(CASE WHEN p.status = 'PENDING' THEN COALESCE(r.valor, p.amount) ELSE 0 END) AS committed
                      FROM accounts_payable p
                      LEFT JOIN payable_rateios r ON r.lancamento_id = p.id AND r.centro_custo_id = :center
                     WHERE p.empresa_id = :company
                       AND (r.id IS NOT NULL OR (p.centro_custo_id = :center AND NOT EXISTS (
                            SELECT 1 FROM payable_rateios all_r WHERE all_r.lancamento_id = p.id)))
                       AND DATE_TRUNC('month', COALESCE(p.competence_date, p.due_date))::date = o.competencia
                  ) v ON TRUE
                 WHERE o.empresa_id = :company AND o.centro_custo_id = :center ORDER BY o.competencia
                """).param("company", user.companyId()).param("center", id).query().listOfRows();
    }

    @PutMapping
    @Transactional
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_CREATE')")
    @ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
    public void save(@PathVariable UUID id, @Valid @RequestBody CostCenterBudgetRequest request) {
        rules.lock();
        rules.reference("centros_custos", id);
        if (request.period().getDayOfMonth() != 1) throw new BusinessException("Use o primeiro dia da competência.");
        jdbc.sql("""
                INSERT INTO centro_custo_orcamento (id, empresa_id, centro_custo_id, competencia, valor_orcado, valor_revisado, observacao)
                VALUES (:id, :company, :center, :period, :planned, :revised, :notes)
                ON CONFLICT (empresa_id, centro_custo_id, competencia) DO UPDATE SET
                    valor_orcado = EXCLUDED.valor_orcado, valor_revisado = EXCLUDED.valor_revisado, observacao = EXCLUDED.observacao
                """).param("id", UUID.randomUUID()).param("company", user.companyId()).param("center", id)
                .param("period", request.period()).param("planned", request.planned()).param("revised", request.revised())
                .param("notes", request.notes()).update();
    }
}

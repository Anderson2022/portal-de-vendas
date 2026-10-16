package br.com.poolcontrol.financeiro.centros;

import br.com.poolcontrol.financeiro.dimensoes.DimensionRules;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/financeiro/cadastros/centros-custo/{id}/lancamentos")
@RequiredArgsConstructor
public class CostCenterEntriesController {
    private final JdbcClient jdbc;
    private final CurrentUserService user;
    private final DimensionRules rules;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_VIEW')")
    public List<Map<String, Object>> list(@PathVariable UUID id) {
        rules.reference("centros_custos", id);
        return jdbc.sql("""
                SELECT p.id, p.description, p.due_date AS "dueDate", p.status, COALESCE(p.competence_date, p.due_date) AS "competenceDate",
                       COALESCE(r.valor, p.amount) AS amount, r.percentual AS percentage
                  FROM accounts_payable p
                  LEFT JOIN payable_rateios r ON r.lancamento_id = p.id AND r.centro_custo_id = :center
                 WHERE p.empresa_id = :company
                   AND (r.id IS NOT NULL OR (p.centro_custo_id = :center AND NOT EXISTS (
                       SELECT 1 FROM payable_rateios all_r WHERE all_r.lancamento_id = p.id)))
                 ORDER BY p.due_date DESC, p.id DESC
                """).param("company", user.companyId()).param("center", id).query().listOfRows();
    }
}

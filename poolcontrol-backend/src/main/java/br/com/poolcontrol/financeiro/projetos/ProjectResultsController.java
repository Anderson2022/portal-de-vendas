package br.com.poolcontrol.financeiro.projetos;

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
@RequestMapping("/api/v1/financeiro/cadastros/projetos/{id}")
@RequiredArgsConstructor
public class ProjectResultsController {
    private final JdbcClient jdbc;
    private final CurrentUserService user;
    private final DimensionRules rules;

    @GetMapping("/resultado")
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_VIEW')")
    public Map<String, Object> summary(@PathVariable Long id) {
        rules.reference("projetos_financeiros", id);
        return jdbc.sql("""
                SELECT p.valor_contratado AS contract,
                       COALESCE((SELECT SUM(valor_orcado) FROM projeto_orcamento
                                 WHERE projeto_id = p.id AND empresa_id = :company), p.orcamento_custo) AS budget,
                       COALESCE((SELECT SUM(amount) FROM accounts_payable
                                 WHERE projeto_id = p.id AND empresa_id = :company AND status = 'PAID'), 0) AS cost,
                       COALESCE((SELECT SUM(amount) FROM accounts_receivable
                                 WHERE projeto_id = p.id AND empresa_id = :company AND status = 'PAID'), 0) AS revenue
                  FROM projetos_financeiros p WHERE p.id = :id AND p.empresa_id = :company
                """).param("company", user.companyId()).param("id", id).query().singleRow();
    }

    @GetMapping("/receitas")
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_VIEW')")
    public List<Map<String, Object>> receipts(@PathVariable Long id) {
        rules.reference("projetos_financeiros", id);
        return jdbc.sql("""
                SELECT id::text AS id, description AS name, amount, status, projeto_id AS "projectId"
                  FROM accounts_receivable WHERE empresa_id = :company AND (projeto_id IS NULL OR projeto_id = :id)
                 ORDER BY due_date DESC
                """).param("company", user.companyId()).param("id", id).query().listOfRows();
    }

    @PutMapping("/receitas")
    @Transactional
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_CREATE')")
    @ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
    public void link(@PathVariable Long id, @Valid @RequestBody ProjectReceiptRequest request) {
        rules.lock();
        rules.reference("projetos_financeiros", id);
        int count = jdbc.sql("""
                UPDATE accounts_receivable SET projeto_id = :project, updated_at = CURRENT_TIMESTAMP
                 WHERE id = :id AND empresa_id = :company AND (projeto_id IS NULL OR projeto_id = :project)
                """).param("project", id).param("id", request.receivableId()).param("company", user.companyId()).update();
        if (count == 0) throw new BusinessException("Receita não encontrada ou vinculada a outro projeto.");
    }
}

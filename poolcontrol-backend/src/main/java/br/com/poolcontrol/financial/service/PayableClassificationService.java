package br.com.poolcontrol.financial.service;

import br.com.poolcontrol.financeiro.dimensoes.DimensionRules;
import br.com.poolcontrol.financial.dto.PayableRequest;
import br.com.poolcontrol.financial.entity.AccountPayable;
import br.com.poolcontrol.shared.exception.BusinessException;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PayableClassificationService {
    private final DimensionRules rules;
    private final JdbcClient jdbc;
    private final CurrentUserService user;

    public void apply(AccountPayable payable, PayableRequest request) {
        rules.lock();
        rules.reference("fornecedores", request.supplierId());
        rules.entry("plano_contas", request.chartAccountId(), request.dueDate());
        rules.entry("centros_custos", request.costCenterId(), request.dueDate());
        rules.entry("filiais", request.unitId(), request.dueDate());
        rules.entry("projetos_financeiros", request.projectId(), request.dueDate());
        UUID nature = request.financialNatureId();
        if (nature == null && request.chartAccountId() != null) {
            nature = jdbc.sql("SELECT natureza_financeira_padrao_id FROM plano_contas WHERE id = :id AND empresa_id = :company")
                    .param("id", request.chartAccountId()).param("company", user.companyId())
                    .query(UUID.class).optional().orElse(null);
        }
        rules.entry("naturezas_financeiras", nature, request.dueDate());
        if (nature != null) {
            boolean allowed = jdbc.sql("""
                    SELECT tipo <> 'TRANSFERENCIA' AND movimento IN ('SAIDA', 'AMBOS')
                      FROM naturezas_financeiras WHERE id = :id AND empresa_id = :company
                    """).param("id", nature).param("company", user.companyId()).query(Boolean.class).single();
            if (!allowed) throw new BusinessException("Conta a pagar exige natureza de saída. Use o fluxo de transferência entre contas para transferências.");
        }
        if (request.projectId() != null && request.unitId() != null) {
            Long unit = jdbc.sql("SELECT unidade_id FROM projetos_financeiros WHERE id = :id AND empresa_id = :company")
                    .param("id", request.projectId()).param("company", user.companyId()).query(Long.class).optional().orElse(null);
            if (unit != null && !unit.equals(request.unitId())) throw new BusinessException("O projeto pertence a outra unidade.");
        }
        payable.setCompetenceDate(request.competenceDate());
        payable.setChartAccountId(request.chartAccountId());
        payable.setCostCenterId(request.costCenterId());
        payable.setUnitId(request.unitId());
        payable.setProjectId(request.projectId());
        payable.setFinancialNatureId(nature);
    }
}

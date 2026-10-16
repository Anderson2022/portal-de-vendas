package br.com.poolcontrol.financial.service;

import br.com.poolcontrol.financeiro.dimensoes.DimensionRules;
import br.com.poolcontrol.financial.dto.PayableRequest;
import br.com.poolcontrol.shared.exception.BusinessException;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashSet;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PayableAllocationService {
    private final JdbcClient jdbc;
    private final CurrentUserService user;
    private final DimensionRules rules;

    public void save(Long payableId, PayableRequest request) {
        var allocations = request.allocations();
        if (allocations == null || allocations.isEmpty()) return;
        var total = allocations.stream().map(item -> item.percentage()).reduce(BigDecimal.ZERO, BigDecimal::add);
        if (total.compareTo(new BigDecimal("100")) != 0) throw new BusinessException("O rateio deve totalizar 100%.");
        var ids = new HashSet<UUID>();
        BigDecimal distributed = BigDecimal.ZERO;
        for (int index = 0; index < allocations.size(); index++) {
            var item = allocations.get(index);
            if (!ids.add(item.costCenterId())) throw new BusinessException("Não repita o centro de custo no rateio.");
            rules.entry("centros_custos", item.costCenterId(), request.dueDate());
            BigDecimal amount = index == allocations.size() - 1
                    ? request.amount().subtract(distributed)
                    : request.amount().multiply(item.percentage()).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
            if (amount.signum() < 0) throw new BusinessException("A distribuição gerou valor negativo. Revise os percentuais.");
            distributed = distributed.add(amount);
            jdbc.sql("""
                    INSERT INTO payable_rateios (id, empresa_id, lancamento_id, centro_custo_id, percentual, valor)
                    VALUES (:id, :company, :payable, :center, :percentage, :amount)
                    """).param("id", UUID.randomUUID()).param("company", user.companyId()).param("payable", payableId)
                    .param("center", item.costCenterId()).param("percentage", item.percentage()).param("amount", amount).update();
        }
    }
}

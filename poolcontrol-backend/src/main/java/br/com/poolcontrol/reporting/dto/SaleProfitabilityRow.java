package br.com.poolcontrol.reporting.dto;



import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record SaleProfitabilityRow(
        Long saleId,
        Long customerId,
        Long salespersonId,
        BigDecimal revenue,
        BigDecimal productCost,
        BigDecimal additionalCost,
        BigDecimal commission,
        BigDecimal totalCost,
        BigDecimal profit,
        BigDecimal marginPercent,
        OffsetDateTime completedAt
) {
}

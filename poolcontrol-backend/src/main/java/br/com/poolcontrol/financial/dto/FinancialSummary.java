package br.com.poolcontrol.financial.dto;



import java.math.BigDecimal;

public record FinancialSummary(
        BigDecimal receivablePending,
        BigDecimal receivablePaid,
        BigDecimal payablePending,
        BigDecimal payablePaid,
        BigDecimal cashResult
) {
}

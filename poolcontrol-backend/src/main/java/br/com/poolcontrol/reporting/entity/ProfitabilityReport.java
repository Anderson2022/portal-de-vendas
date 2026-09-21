package br.com.poolcontrol.reporting.entity;
import br.com.poolcontrol.reporting.dto.SaleProfitabilityRow;



import java.math.BigDecimal;
import java.util.List;

public record ProfitabilityReport(
        BigDecimal totalRevenue,
        BigDecimal totalCost,
        BigDecimal totalProfit,
        BigDecimal averageMargin,
        List<SaleProfitabilityRow> sales
) {
}

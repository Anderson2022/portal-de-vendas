package br.com.poolcontrol.dashboard.dto;



import java.math.BigDecimal;

public record DashboardSummary(
        BigDecimal revenue,
        BigDecimal profit,
        BigDecimal averageMargin,
        long completedSales,
        BigDecimal receivable,
        BigDecimal payable,
        long criticalStockItems,
        long lowStockItems,
        long openQuotes
) {
}

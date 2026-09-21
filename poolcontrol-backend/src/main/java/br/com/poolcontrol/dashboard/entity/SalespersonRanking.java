package br.com.poolcontrol.dashboard.entity;



import java.math.BigDecimal;

public record SalespersonRanking(
        Long salespersonId,
        String name,
        BigDecimal sales,
        BigDecimal profit,
        long quantity
) {
}

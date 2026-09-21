package br.com.poolcontrol.inventory.dto;



import java.math.BigDecimal;

public record StockSummary(
        Long productId,
        String productName,
        BigDecimal physical,
        BigDecimal reserved,
        BigDecimal available,
        BigDecimal minimumStock,
        String status
) {
}

package br.com.poolcontrol.sales.event;



import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record SaleCompletedEvent(
        Long companyId,
        Long saleId,
        Long customerId,
        Long salespersonId,
        Long completedBy,
        BigDecimal totalSale,
        BigDecimal commissionRate,
        BigDecimal commissionAmount,
        List<Item> items,
        List<Payment> payments
) {
    public record Item(
            Long productId,
            BigDecimal quantity,
            BigDecimal unitCost
    ) {}

    public record Payment(
            BigDecimal amount,
            LocalDate dueDate,
            String paymentMethod
    ) {}
}

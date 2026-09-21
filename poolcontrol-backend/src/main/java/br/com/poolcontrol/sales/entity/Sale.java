package br.com.poolcontrol.sales.entity;



import br.com.poolcontrol.shared.domain.TenantEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "sales")
public class Sale extends TenantEntity {

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "salesperson_id")
    private Long salespersonId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SaleStatus status = SaleStatus.DRAFT;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "total_sale", nullable = false, precision = 14, scale = 2)
    private BigDecimal totalSale = BigDecimal.ZERO;

    @Column(name = "product_cost", nullable = false, precision = 14, scale = 2)
    private BigDecimal productCost = BigDecimal.ZERO;

    @Column(name = "additional_cost", nullable = false, precision = 14, scale = 2)
    private BigDecimal additionalCost = BigDecimal.ZERO;

    @Column(name = "commission_rate", nullable = false, precision = 8, scale = 4)
    private BigDecimal commissionRate = BigDecimal.ZERO;

    @Column(name = "commission_amount", nullable = false, precision = 14, scale = 2)
    private BigDecimal commissionAmount = BigDecimal.ZERO;

    @Column(name = "total_cost", nullable = false, precision = 14, scale = 2)
    private BigDecimal totalCost = BigDecimal.ZERO;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal profit = BigDecimal.ZERO;

    @Column(name = "margin_percent", nullable = false, precision = 8, scale = 4)
    private BigDecimal marginPercent = BigDecimal.ZERO;

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;
    @Column(length = 180)
    private String project;
    @Column(length = 5000)
    private String notes;
    @Column(name = "quote_id")
    private Long quoteId;
}

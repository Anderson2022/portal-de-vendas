package br.com.poolcontrol.financial.entity;

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
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "accounts_payable")
public class AccountPayable extends TenantEntity {

    @Column(name = "supplier_id")
    private Long supplierId;

    @Column(nullable = false, length = 220)
    private String description;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal amount;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FinancialStatus status = FinancialStatus.PENDING;

    @Column(name = "paid_at")
    private OffsetDateTime paidAt;
}

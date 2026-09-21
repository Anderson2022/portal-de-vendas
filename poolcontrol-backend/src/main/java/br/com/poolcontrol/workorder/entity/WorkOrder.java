package br.com.poolcontrol.workorder.entity;



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
@Table(name = "work_orders")
public class WorkOrder extends TenantEntity {

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "pool_id")
    private Long poolId;

    @Column(name = "assigned_user_id")
    private Long assignedUserId;

    @Column(nullable = false, length = 80)
    private String type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WorkOrderStatus status = WorkOrderStatus.SCHEDULED;

    @Column(name = "scheduled_at")
    private OffsetDateTime scheduledAt;

    @Column(name = "started_at")
    private OffsetDateTime startedAt;

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

    @Column(length = 1500)
    private String description;

    @Column(name = "labor_cost", nullable = false, precision = 14, scale = 2)
    private BigDecimal laborCost = BigDecimal.ZERO;
}

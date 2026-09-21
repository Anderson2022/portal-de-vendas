package br.com.poolcontrol.workorder.dto;
import br.com.poolcontrol.workorder.entity.WorkOrder;



import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public record WorkOrderRequest(
        @NotNull Long customerId,
        Long poolId,
        Long assignedUserId,
        @NotBlank String type,
        OffsetDateTime scheduledAt,
        String description,
        @DecimalMin("0.00") BigDecimal laborCost,
        List<@Valid Material> materials
) {
    public record Material(
            @NotNull Long productId,
            @NotNull @DecimalMin("0.001") BigDecimal quantity
    ) {}
}

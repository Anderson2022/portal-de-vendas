package br.com.poolcontrol.inventory.dto;



import br.com.poolcontrol.inventory.entity.StockMovementType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record StockMovementRequest(
        @NotNull Long productId,
        Long warehouseId,
        Long locationId,
        @NotNull StockMovementType type,
        @NotNull BigDecimal quantity,
        @NotNull @DecimalMin("0.00") BigDecimal unitCost,
        String referenceType,
        Long referenceId,
        String notes
) {
}

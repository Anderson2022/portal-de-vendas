package br.com.poolcontrol.workorder.event;
import br.com.poolcontrol.workorder.entity.WorkOrder;



import java.math.BigDecimal;
import java.util.List;

public record WorkOrderCompletedEvent(
        Long companyId,
        Long workOrderId,
        Long completedBy,
        List<Material> materials
) {
    public record Material(Long productId, BigDecimal quantity, BigDecimal unitCost) {}
}

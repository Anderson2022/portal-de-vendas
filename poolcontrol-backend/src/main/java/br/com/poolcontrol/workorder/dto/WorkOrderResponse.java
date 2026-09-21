package br.com.poolcontrol.workorder.dto;



import br.com.poolcontrol.workorder.entity.WorkOrder;
import br.com.poolcontrol.workorder.entity.WorkOrderMaterial;

import java.util.List;

public record WorkOrderResponse(
        WorkOrder workOrder,
        List<WorkOrderMaterial> materials
) {
}

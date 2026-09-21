package br.com.poolcontrol.inventory.service;



import br.com.poolcontrol.inventory.dto.StockMovementRequest;
import br.com.poolcontrol.inventory.entity.StockMovementType;
import br.com.poolcontrol.workorder.event.WorkOrderCompletedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WorkOrderInventoryListener {

    private final InventoryService inventoryService;

    @EventListener
    public void on(WorkOrderCompletedEvent event) {
        for (var material : event.materials()) {
            inventoryService.move(new StockMovementRequest(
                    material.productId(),
                    null,
                    null,
                    StockMovementType.EXIT,
                    material.quantity(),
                    material.unitCost(),
                    "WORK_ORDER",
                    event.workOrderId(),
                    "Baixa automÃ¡tica da ordem de serviÃ§o concluÃ­da"
            ));
        }
    }
}

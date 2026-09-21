package br.com.poolcontrol.inventory.service;



import br.com.poolcontrol.inventory.dto.StockMovementRequest;
import br.com.poolcontrol.inventory.entity.StockMovementType;
import br.com.poolcontrol.sales.event.SaleCompletedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SaleInventoryListener {

    private final InventoryService inventoryService;

    @EventListener
    public void on(SaleCompletedEvent event) {
        for (var item : event.items()) {
            inventoryService.move(new StockMovementRequest(
                    item.productId(),
                    null,
                    null,
                    StockMovementType.EXIT,
                    item.quantity(),
                    item.unitCost(),
                    "SALE",
                    event.saleId(),
                    "Baixa automÃ¡tica da venda concluÃ­da"
            ));
        }
    }
}

package br.com.poolcontrol.inventory.controller;
import br.com.poolcontrol.inventory.dto.StockMovementRequest;
import br.com.poolcontrol.inventory.dto.StockSummary;



import br.com.poolcontrol.inventory.service.InventoryService;
import br.com.poolcontrol.inventory.entity.StockMovement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService service;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_STOCK_VIEW')")
    public List<StockSummary> list() {
        return service.listSummaries();
    }

    @GetMapping("/{productId}")
    @PreAuthorize("hasAuthority('PERM_STOCK_VIEW')")
    public StockSummary summary(@PathVariable Long productId) {
        return service.summary(productId);
    }

    @GetMapping("/{productId}/history")
    @PreAuthorize("hasAuthority('PERM_STOCK_VIEW')")
    public List<StockMovement> history(@PathVariable Long productId) {
        return service.history(productId);
    }

    @PostMapping("/movements")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('PERM_STOCK_MOVE')")
    public StockMovement move(@Valid @RequestBody StockMovementRequest request) {
        return service.move(request);
    }
}

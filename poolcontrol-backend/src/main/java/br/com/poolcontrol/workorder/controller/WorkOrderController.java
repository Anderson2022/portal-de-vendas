package br.com.poolcontrol.workorder.controller;
import br.com.poolcontrol.workorder.dto.WorkOrderRequest;
import br.com.poolcontrol.workorder.dto.WorkOrderResponse;



import br.com.poolcontrol.workorder.service.WorkOrderService;
import br.com.poolcontrol.workorder.entity.WorkOrder;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/work-orders")
@RequiredArgsConstructor
public class WorkOrderController {

    private final WorkOrderService service;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_WORK_ORDER_VIEW')")
    public List<WorkOrder> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_WORK_ORDER_VIEW')")
    public WorkOrderResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('PERM_WORK_ORDER_CREATE')")
    public WorkOrderResponse create(@Valid @RequestBody WorkOrderRequest request) {
        return service.create(request);
    }

    @PostMapping("/{id}/start")
    @PreAuthorize("hasAuthority('PERM_WORK_ORDER_EXECUTE')")
    public WorkOrderResponse start(@PathVariable Long id) {
        return service.start(id);
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasAuthority('PERM_WORK_ORDER_EXECUTE')")
    public WorkOrderResponse complete(@PathVariable Long id) {
        return service.complete(id);
    }
}

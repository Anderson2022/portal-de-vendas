package br.com.poolcontrol.commission.controller;



import br.com.poolcontrol.commission.service.CommissionService;
import br.com.poolcontrol.commission.entity.Commission;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/commissions")
@RequiredArgsConstructor
public class CommissionController {

    private final CommissionService service;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_COMMISSION_VIEW')")
    public List<Commission> list() {
        return service.list();
    }

    @PostMapping("/{id}/pay")
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_CREATE')")
    public Commission pay(@PathVariable Long id) {
        return service.pay(id);
    }
}

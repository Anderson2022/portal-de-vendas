package br.com.poolcontrol.sales.controller;
import br.com.poolcontrol.sales.dto.SaleCreateRequest;
import br.com.poolcontrol.sales.dto.SaleResponse;



import br.com.poolcontrol.sales.service.SaleService;
import br.com.poolcontrol.sales.entity.Sale;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService service;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_SALE_VIEW')")
    public List<Sale> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_SALE_VIEW')")
    public SaleResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('PERM_SALE_CREATE')")
    public SaleResponse create(@Valid @RequestBody SaleCreateRequest request) {
        return service.create(request);
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasAuthority('PERM_SALE_COMPLETE')")
    public SaleResponse complete(@PathVariable Long id) {
        return service.complete(id);
    }
    @PostMapping("/register")
    @PreAuthorize("hasAuthority('PERM_SALE_CREATE') and hasAuthority('PERM_SALE_COMPLETE') and hasAuthority('PERM_FINANCIAL_CREATE')")
    public SaleResponse register(@Valid @RequestBody SaleCreateRequest request, @RequestParam(defaultValue="false") boolean paid) { return service.register(request, paid); }
}

package br.com.poolcontrol.supplier.controller;
import br.com.poolcontrol.supplier.dto.SupplierRequest;



import br.com.poolcontrol.supplier.service.SupplierService;
import br.com.poolcontrol.supplier.entity.Supplier;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService service;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_SUPPLIER_VIEW')")
    public List<Supplier> list() {
        return service.list();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('PERM_SUPPLIER_MANAGE')")
    public Supplier create(@Valid @RequestBody SupplierRequest request) {
        return service.create(request);
    }
}

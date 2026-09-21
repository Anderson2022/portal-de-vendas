package br.com.poolcontrol.salesperson.controller;
import br.com.poolcontrol.salesperson.dto.SalespersonRequest;



import br.com.poolcontrol.salesperson.service.SalespersonService;
import br.com.poolcontrol.salesperson.entity.Salesperson;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/salespeople")
@RequiredArgsConstructor
public class SalespersonController {

    private final SalespersonService service;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_SALESPERSON_VIEW')")
    public List<Salesperson> list() {
        return service.list();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('PERM_SALESPERSON_MANAGE')")
    public Salesperson create(@Valid @RequestBody SalespersonRequest request) {
        return service.create(request);
    }
}

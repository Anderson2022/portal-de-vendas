package br.com.poolcontrol.pool.controller;

import br.com.poolcontrol.pool.dto.PoolRequest;

import br.com.poolcontrol.pool.service.PoolService;
import br.com.poolcontrol.pool.entity.CustomerPool;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pools")
@RequiredArgsConstructor
public class PoolController {

    private final PoolService service;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_POOL_VIEW')")
    public List<CustomerPool> list(@RequestParam(required = false) Long customerId) {
        return customerId == null ? service.list() : service.listByCustomer(customerId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('PERM_POOL_CREATE')")
    public CustomerPool create(@Valid @RequestBody PoolRequest request) {
        return service.create(request);
    }
}

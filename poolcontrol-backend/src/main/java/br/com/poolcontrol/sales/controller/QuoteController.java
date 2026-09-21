package br.com.poolcontrol.sales.controller;
import br.com.poolcontrol.sales.dto.QuoteConversionRequest;
import br.com.poolcontrol.sales.dto.QuoteRequest;
import br.com.poolcontrol.sales.dto.QuoteResponse;
import br.com.poolcontrol.sales.dto.SaleResponse;



import br.com.poolcontrol.sales.service.QuoteService;
import br.com.poolcontrol.sales.entity.Quote;
import br.com.poolcontrol.sales.entity.QuoteStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/quotes")
@RequiredArgsConstructor
public class QuoteController {

    private final QuoteService service;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_SALE_VIEW')")
    public List<Quote> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_SALE_VIEW')")
    public QuoteResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('PERM_SALE_CREATE')")
    public QuoteResponse create(@Valid @RequestBody QuoteRequest request) {
        return service.create(request);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('PERM_SALE_CREATE')")
    public QuoteResponse changeStatus(@PathVariable Long id, @RequestParam QuoteStatus status) {
        return service.changeStatus(id, status);
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_SALE_CREATE')")
    public QuoteResponse update(@PathVariable Long id, @Valid @RequestBody QuoteRequest request) { return service.update(id, request); }

    @PostMapping("/{id}/convert")
    @PreAuthorize("hasAuthority('PERM_SALE_CREATE') and hasAuthority('PERM_SALE_COMPLETE') and hasAuthority('PERM_FINANCIAL_CREATE')")
    public SaleResponse convert(@PathVariable Long id, @Valid @RequestBody QuoteConversionRequest request) { return service.convert(id, request); }
}

package br.com.poolcontrol.financeiro.naturezas;

import jakarta.validation.Valid;
import br.com.poolcontrol.financeiro.dimensoes.DimensionHistory;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/financeiro/cadastros/naturezas-financeiras")
@RequiredArgsConstructor
public class FinancialNatureController {
    private final FinancialNatureRepository repository;
    private final FinancialNatureService service;
    private final DimensionHistory history;

    @GetMapping("/{id}/historico")
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_VIEW')")
    public List<Map<String, Object>> history(@PathVariable UUID id) {
        return history.list("naturezas_financeiras", id);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_VIEW')")
    public List<Map<String, Object>> list() {
        return repository.list();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_CREATE')")
    public Map<String, String> create(@Valid @RequestBody FinancialNatureRequest request) {
        return Map.of("id", service.save(null, request).toString());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_CREATE')")
    public Map<String, String> update(@PathVariable UUID id, @Valid @RequestBody FinancialNatureRequest request) {
        return Map.of("id", service.save(id, request).toString());
    }
}

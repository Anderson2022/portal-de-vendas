package br.com.poolcontrol.financeiro.centros;

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
@RequestMapping("/api/v1/financeiro/cadastros/centros-custo")
@RequiredArgsConstructor
public class CostCenterController {
    private final CostCenterRepository repository;
    private final CostCenterService service;
    private final DimensionHistory history;

    @GetMapping("/{id}/historico")
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_VIEW')")
    public List<Map<String, Object>> history(@PathVariable UUID id) {
        return history.list("centros_custos", id);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_VIEW')")
    public List<Map<String, Object>> list() {
        return repository.list();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_CREATE')")
    public Map<String, String> create(@Valid @RequestBody CostCenterRequest request) {
        return Map.of("id", service.save(null, request).toString());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_CREATE')")
    public Map<String, String> update(@PathVariable UUID id, @Valid @RequestBody CostCenterRequest request) {
        return Map.of("id", service.save(id, request).toString());
    }
}

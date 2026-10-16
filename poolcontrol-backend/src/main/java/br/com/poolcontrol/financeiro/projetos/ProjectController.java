package br.com.poolcontrol.financeiro.projetos;

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
@RequestMapping("/api/v1/financeiro/cadastros/projetos")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectRepository repository;
    private final ProjectService service;
    private final DimensionHistory history;

    @GetMapping("/{id}/historico")
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_VIEW')")
    public List<Map<String, Object>> history(@PathVariable Long id) {
        return history.list("projetos_financeiros", id);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_VIEW')")
    public List<Map<String, Object>> list() {
        return repository.list();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_CREATE')")
    public Map<String, String> create(@Valid @RequestBody ProjectRequest request) {
        return Map.of("id", service.save(null, request).toString());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_CREATE')")
    public Map<String, String> update(@PathVariable Long id, @Valid @RequestBody ProjectRequest request) {
        return Map.of("id", service.save(id, request).toString());
    }
}

package br.com.poolcontrol.catalog.controller;

import br.com.poolcontrol.catalog.dto.ProductReferenceRequest;
import br.com.poolcontrol.catalog.dto.ProductReferenceResponse;
import br.com.poolcontrol.catalog.service.ProductReferenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/product-references")
@RequiredArgsConstructor
public class ProductReferenceController {
    private final ProductReferenceService service;

    @GetMapping("/{kind}")
    public List<ProductReferenceResponse> list(@PathVariable String kind) {
        return service.list(kind);
    }

    @PostMapping("/{kind}")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductReferenceResponse create(@PathVariable String kind,
            @Valid @RequestBody ProductReferenceRequest request) {
        return service.create(kind, request);
    }

    @GetMapping("/{kind}/{id}")
    public Map<String, Object> get(@PathVariable String kind, @PathVariable Long id) {
        return service.get(kind, id);
    }

    @PutMapping("/{kind}/{id}")
    public ProductReferenceResponse update(@PathVariable String kind, @PathVariable Long id,
            @Valid @RequestBody ProductReferenceRequest request) {
        return service.update(kind, id, request);
    }

    @DeleteMapping("/{kind}/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String kind, @PathVariable Long id) {
        service.delete(kind, id);
    }
}

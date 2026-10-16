package br.com.poolcontrol.financeiro.contas.cadastros;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/financeiro/cadastros/plano-contas/lookups")
@RequiredArgsConstructor
public class ChartLookupController {
    private final ChartLookupRepository repository;

    @GetMapping
    public Map<String, Object> list() {
        var result = new LinkedHashMap<String, Object>();
        for (var definition : ChartLookupDefinition.ALL) {
            var item = new LinkedHashMap<String, Object>();
            item.put("options", repository.list(definition));
            item.put("canCreate", definition.creatable());
            item.put("parentKey", definition.parentKey());
            result.put(definition.key(), item);
        }
        return result;
    }

    @PostMapping("/{key}")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> create(@PathVariable String key, @Valid @RequestBody CreateChartLookupRequest request) {
        return repository.create(key, request);
    }
}

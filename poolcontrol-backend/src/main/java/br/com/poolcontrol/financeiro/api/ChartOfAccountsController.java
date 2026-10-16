package br.com.poolcontrol.financeiro.api;

import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.poolcontrol.financeiro.contas.ChartAccountService;
import br.com.poolcontrol.financeiro.contas.ChartAccountReadService;
import br.com.poolcontrol.financeiro.contas.UpdateChartAccountRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.UUID;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/financeiro/cadastros/plano-contas")
@RequiredArgsConstructor
public class ChartOfAccountsController {
    private final ChartAccountService accounts;
    private final ChartAccountReadService reader;
    private final JdbcClient jdbc;
    private final CurrentUserService currentUser;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, UUID> create(@Valid @RequestBody UpdateChartAccountRequest request) {
        return Map.of("id", accounts.create(request));
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@PathVariable UUID id) {
        return reader.get(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@PathVariable UUID id, @Valid @RequestBody UpdateChartAccountRequest request) {
        accounts.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        accounts.delete(id);
    }

    @GetMapping
    public List<Map<String, Object>> list() {
        return jdbc.sql("""
                SELECT p.id,
                       p.codigo AS code,
                       p.codigo_reduzido AS "shortCode",
                       p.nome AS name,
                       p.conta_pai_id AS "parentId",
                       pai.codigo AS "parentCode",
                       pai.nome AS "parentName",
                       t.nome AS "accountType",
                       n.nome AS nature,
                       p.ativo AS active
                  FROM plano_contas p
             LEFT JOIN plano_contas pai ON pai.id = p.conta_pai_id
             LEFT JOIN tipos_conta_contabil t ON t.id = p.tipo_conta_id
             LEFT JOIN naturezas_contabeis n ON n.id = p.natureza_id
                 WHERE p.empresa_id = :company
                   AND p.excluido_em IS NULL
              ORDER BY string_to_array(p.codigo, '.')::int[]
                """)
                .param("company", currentUser.companyId())
                .query()
                .listOfRows();
    }
}

package br.com.poolcontrol.financeiro.api;

import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/financeiro/cadastros/plano-contas")
@RequiredArgsConstructor
public class ChartOfAccountsController {
    private final JdbcClient jdbc;
    private final CurrentUserService currentUser;

    @GetMapping
    public List<Map<String, Object>> list() {
        return jdbc.sql("""
                SELECT p.id,
                       p.codigo AS code,
                       p.codigo_reduzido AS "shortCode",
                       p.nome AS name,
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

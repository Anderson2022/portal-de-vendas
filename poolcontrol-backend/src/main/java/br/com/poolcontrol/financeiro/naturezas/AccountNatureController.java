package br.com.poolcontrol.financeiro.naturezas;

import br.com.poolcontrol.financeiro.dimensoes.DimensionRules;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/financeiro/cadastros/plano-contas/{id}/natureza-padrao")
@RequiredArgsConstructor
public class AccountNatureController {
    private final JdbcClient jdbc;
    private final CurrentUserService user;
    private final DimensionRules rules;

    @PutMapping
    @Transactional
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_CREATE')")
    @ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
    public void save(@PathVariable UUID id, @RequestBody AccountNatureRequest request) {
        rules.lock();
        rules.reference("plano_contas", id);
        rules.reference("naturezas_financeiras", request.natureId());
        jdbc.sql("""
                UPDATE plano_contas SET natureza_financeira_padrao_id = :nature, atualizado_em = CURRENT_TIMESTAMP
                 WHERE id = :id AND empresa_id = :company
                """).param("id", id).param("nature", request.natureId()).param("company", user.companyId()).update();
    }
}

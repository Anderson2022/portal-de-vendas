package br.com.poolcontrol.financeiro.contas;

import br.com.poolcontrol.financeiro.contas.cadastros.ChartLookupRepository;
import br.com.poolcontrol.shared.exception.BusinessException;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ChartAccountHierarchy {
    private final JdbcClient jdbc;
    private final CurrentUserService currentUser;
    private final ChartLookupRepository lookups;

    public void validate(UUID id, UpdateChartAccountRequest request) {
        if (id.equals(request.parentId())) throw new BusinessException("Uma conta não pode ser sua própria conta pai.");
        if (request.parentId() == null) {
            if (request.code().contains(".")) throw new BusinessException("Selecione a conta pai para um código com subníveis.");
            return;
        }
        var parent = lookups.require("parentAccount", request.parentId());
        String prefix = parent.get("code") + ".";
        if (!request.code().startsWith(prefix) || request.code().substring(prefix.length()).contains(".")) {
            throw new BusinessException("O código deve ser um nível abaixo do código da conta pai: " + prefix);
        }
        boolean cycle = jdbc.sql("""
                WITH RECURSIVE ancestors AS (
                    SELECT id, conta_pai_id FROM plano_contas WHERE id = :parent AND empresa_id = :company
                    UNION
                    SELECT p.id, p.conta_pai_id FROM plano_contas p
                    JOIN ancestors a ON p.id = a.conta_pai_id WHERE p.empresa_id = :company
                ) SELECT EXISTS (SELECT 1 FROM ancestors WHERE id = :id)
                """).param("parent", request.parentId()).param("company", currentUser.companyId())
                .param("id", id).query(Boolean.class).single();
        if (cycle) throw new BusinessException("A conta pai selecionada é descendente desta conta.");
    }

    public void recodeDescendants(UUID id, String previous, String next) {
        if (previous.equals(next)) return;
        jdbc.sql("""
                WITH RECURSIVE descendants AS (
                    SELECT id FROM plano_contas WHERE conta_pai_id = :id AND empresa_id = :company
                    UNION
                    SELECT p.id FROM plano_contas p JOIN descendants d ON p.conta_pai_id = d.id
                    WHERE p.empresa_id = :company
                )
                UPDATE plano_contas SET codigo = :next || substring(codigo FROM :offset),
                    nivel = cardinality(string_to_array(:next || substring(codigo FROM :offset), '.')),
                    atualizado_em = CURRENT_TIMESTAMP
                WHERE id IN (SELECT id FROM descendants) AND empresa_id = :company
                """).param("id", id).param("company", currentUser.companyId())
                .param("next", next).param("offset", previous.length() + 1).update();
    }
}

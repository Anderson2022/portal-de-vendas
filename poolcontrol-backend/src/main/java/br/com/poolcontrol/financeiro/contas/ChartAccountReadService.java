package br.com.poolcontrol.financeiro.contas;

import br.com.poolcontrol.financeiro.contas.fiscal.FiscalSettingsRepository;
import br.com.poolcontrol.financeiro.contas.integrations.IntegrationSettingsRepository;
import br.com.poolcontrol.financeiro.contas.notes.AccountNotesRepository;
import br.com.poolcontrol.shared.exception.NotFoundException;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChartAccountReadService {
    private final JdbcClient jdbc;
    private final CurrentUserService currentUser;
    private final ChartAccountLinks links;
    private final FiscalSettingsRepository fiscal;
    private final IntegrationSettingsRepository integrations;
    private final AccountNotesRepository notes;

    public Map<String, Object> get(UUID id) {
        var rows = jdbc.sql("""
                SELECT p.id, p.codigo AS code, p.codigo_reduzido AS "shortCode",
                       p.nome AS name, p.ativo AS active,
                       p.conta_pai_id AS "parentId", pai.nome AS "parentName",
                       t.nome AS "accountType", n.nome AS nature,
                       g.nome AS "groupName", s.nome AS "subgroupName",
                       p.aceita_lancamento AS "acceptsEntries",
                       p.permite_centro_custo AS "allowsCostCenter",
                       p.exige_historico AS "requiresHistory",
                       p.grupo_id AS "groupId", p.subgrupo_id AS "subgroupId",
                       p.tipo_conta_id AS "typeId", p.natureza_id AS "natureId",
                       p.atualizado_em AS "updatedAt"
                  FROM plano_contas p
             LEFT JOIN plano_contas pai ON pai.id = p.conta_pai_id
             LEFT JOIN tipos_conta_contabil t ON t.id = p.tipo_conta_id
             LEFT JOIN naturezas_contabeis n ON n.id = p.natureza_id
             LEFT JOIN grupos_contabeis g ON g.id = p.grupo_id
             LEFT JOIN subgrupos_contabeis s ON s.id = p.subgrupo_id
                 WHERE p.id = :id AND p.empresa_id = :company AND p.excluido_em IS NULL
                """).param("id", id).param("company", currentUser.companyId()).query().listOfRows();
        if (rows.isEmpty()) {
            throw new NotFoundException("Plano de contas não encontrado.");
        }
        var result = new LinkedHashMap<>(rows.getFirst());
        result.put("hasLinks", links.exists(id));
        result.put("fiscal", fiscal.get(id));
        result.put("integrations", integrations.get(id));
        result.put("notes", notes.get(id));
        return result;
    }

}

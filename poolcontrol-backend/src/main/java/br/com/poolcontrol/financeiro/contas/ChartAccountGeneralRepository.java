package br.com.poolcontrol.financeiro.contas;

import br.com.poolcontrol.financeiro.contas.cadastros.ChartLookupRepository;
import br.com.poolcontrol.shared.exception.BusinessException;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class ChartAccountGeneralRepository {
    private final JdbcClient jdbc;
    private final CurrentUserService currentUser;
    private final ChartLookupRepository lookups;

    public void save(UUID id, UpdateChartAccountRequest request) {
        lookups.require("accountGroup", request.groupId());
        var subgroup = lookups.require("accountSubgroup", request.subgroupId());
        if (request.subgroupId() != null && !request.groupId().toString().equals(subgroup.get("parentId"))) {
            throw new BusinessException("O subgrupo não pertence ao grupo selecionado.");
        }
        var type = lookups.require("accountType", request.typeId());
        var nature = lookups.require("accountNature", request.natureId());
        jdbc.sql("""
                INSERT INTO plano_contas (
                    id, empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
                    grupo_id, subgrupo_id, tipo_conta_id, natureza_id, natureza, sintetica,
                    ativo, aceita_lancamento, permite_centro_custo, exige_historico, criado_em, atualizado_em
                ) VALUES (
                    :id, :company, :code, :shortCode, :name, :parent, :level,
                    :groupId, :subgroup, :type, :natureId, :nature, :synthetic,
                    :active, :entries, :costCenter, :history, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
                ) ON CONFLICT (id) DO UPDATE SET
                    codigo = EXCLUDED.codigo, codigo_reduzido = EXCLUDED.codigo_reduzido,
                    nome = EXCLUDED.nome, conta_pai_id = EXCLUDED.conta_pai_id, nivel = EXCLUDED.nivel,
                    grupo_id = EXCLUDED.grupo_id, subgrupo_id = EXCLUDED.subgrupo_id,
                    tipo_conta_id = EXCLUDED.tipo_conta_id, natureza_id = EXCLUDED.natureza_id,
                    natureza = EXCLUDED.natureza, sintetica = EXCLUDED.sintetica, ativo = EXCLUDED.ativo,
                    aceita_lancamento = EXCLUDED.aceita_lancamento,
                    permite_centro_custo = EXCLUDED.permite_centro_custo,
                    exige_historico = EXCLUDED.exige_historico, atualizado_em = CURRENT_TIMESTAMP
                WHERE plano_contas.empresa_id = :company AND plano_contas.excluido_em IS NULL
                """).param("id", id).param("company", currentUser.companyId())
                .param("code", request.code()).param("shortCode", request.shortCode().trim())
                .param("name", request.name().trim()).param("parent", request.parentId())
                .param("level", request.code().split("\\.").length)
                .param("groupId", request.groupId()).param("subgroup", request.subgroupId())
                .param("type", request.typeId()).param("natureId", request.natureId())
                .param("nature", nature.get("code")).param("synthetic", "SINTETICA".equals(type.get("code")))
                .param("active", request.active()).param("entries", request.acceptsEntries())
                .param("costCenter", request.allowsCostCenter()).param("history", request.requiresHistory()).update();
    }
}

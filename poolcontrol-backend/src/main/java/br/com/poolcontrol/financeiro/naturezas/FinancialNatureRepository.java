package br.com.poolcontrol.financeiro.naturezas;

import br.com.poolcontrol.shared.security.CurrentUserService;
import br.com.poolcontrol.shared.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class FinancialNatureRepository {
    private final JdbcClient jdbc;
    private final CurrentUserService user;

    public List<Map<String, Object>> list() {
        return jdbc.sql("""
                SELECT id::text AS id,
                       codigo AS "code",
                       nome AS "name",
                       descricao AS "description",
                       natureza_pai_id AS "parentId",
                       tipo AS "type",
                       grupo AS "group",
                       movimento AS "movement",
                       impacta_fluxo_caixa AS "affectsCashFlow",
                       impacta_dre AS "affectsDre",
                       impacta_resultado AS "affectsResult",
                       aceita_lancamento AS "acceptsEntries",
                       ordem AS "displayOrder",
                       cor AS "color",
                       icone AS "icon",
                       data_inicio AS "startDate",
                       data_fim AS "endDate",
                       observacao AS "notes",
                       ativo AS "active",
                       criado_em AS "createdAt", atualizado_em AS "updatedAt",
                       criado_por AS "createdBy", atualizado_por AS "updatedBy"
                  FROM naturezas_financeiras WHERE empresa_id = :company
                 ORDER BY codigo
                """).param("company", user.companyId()).query().listOfRows();
    }

    public UUID save(UUID id, FinancialNatureRequest request) {
        String sql = id == null ? """
                INSERT INTO naturezas_financeiras (id, empresa_id, codigo, nome, descricao, natureza_pai_id, tipo, grupo, movimento, impacta_fluxo_caixa, impacta_dre, impacta_resultado, aceita_lancamento, ordem, cor, icone, data_inicio, data_fim, observacao, ativo, criado_em, atualizado_em, criado_por, atualizado_por)
                VALUES (:id, :company, :code, :name, :description, :parentId, :type, :group, :movement, :affectsCashFlow, :affectsDre, :affectsResult, :acceptsEntries, :displayOrder, :color, :icon, :startDate, :endDate, :notes, :active, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, :actor, :actor)
                RETURNING id
                """ : """
                UPDATE naturezas_financeiras SET codigo = :code,
                    nome = :name,
                    descricao = :description,
                    natureza_pai_id = :parentId,
                    tipo = :type,
                    grupo = :group,
                    movimento = :movement,
                    impacta_fluxo_caixa = :affectsCashFlow,
                    impacta_dre = :affectsDre,
                    impacta_resultado = :affectsResult,
                    aceita_lancamento = :acceptsEntries,
                    ordem = :displayOrder,
                    cor = :color,
                    icone = :icon,
                    data_inicio = :startDate,
                    data_fim = :endDate,
                    observacao = :notes,
                    ativo = :active,
                    atualizado_em = CURRENT_TIMESTAMP, atualizado_por = :actor
                 WHERE id = :id AND empresa_id = :company
                RETURNING id
                """;
        return jdbc.sql(sql).param("id", id == null ? UUID.randomUUID() : id)
                .param("company", user.companyId()).param("actor", user.userId())
                .param("code", request.code())
                .param("name", request.name())
                .param("description", request.description())
                .param("parentId", request.parentId())
                .param("type", request.type())
                .param("group", request.group())
                .param("movement", request.movement())
                .param("affectsCashFlow", request.affectsCashFlow())
                .param("affectsDre", request.affectsDre())
                .param("affectsResult", request.affectsResult())
                .param("acceptsEntries", request.acceptsEntries())
                .param("displayOrder", request.displayOrder())
                .param("color", request.color())
                .param("icon", request.icon())
                .param("startDate", request.startDate())
                .param("endDate", request.endDate())
                .param("notes", request.notes())
                .param("active", request.active())
                .query(UUID.class).optional()
                .orElseThrow(() -> new NotFoundException("Cadastro não encontrado."));
    }
}

package br.com.poolcontrol.financeiro.centros;

import br.com.poolcontrol.shared.security.CurrentUserService;
import br.com.poolcontrol.shared.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository("dimensionCostCenterRepository")
@RequiredArgsConstructor
public class CostCenterRepository {
    private final JdbcClient jdbc;
    private final CurrentUserService user;

    public List<Map<String, Object>> list() {
        return jdbc.sql("""
                SELECT id::text AS id,
                       codigo AS "code",
                       nome AS "name",
                       descricao AS "description",
                       centro_pai_id AS "parentId",
                       tipo AS "type",
                       responsavel_id AS "responsibleId",
                       aceita_lancamento AS "acceptsEntries",
                       data_inicio AS "startDate",
                       data_fim AS "endDate",
                       observacao AS "notes",
                       ativo AS "active",
                       criado_em AS "createdAt", atualizado_em AS "updatedAt",
                       criado_por AS "createdBy", atualizado_por AS "updatedBy"
                  FROM centros_custos WHERE empresa_id = :company AND excluido_em IS NULL
                 ORDER BY codigo
                """).param("company", user.companyId()).query().listOfRows();
    }

    public UUID save(UUID id, CostCenterRequest request) {
        String sql = id == null ? """
                INSERT INTO centros_custos (id, empresa_id, codigo, nome, descricao, centro_pai_id, tipo, responsavel_id, aceita_lancamento, data_inicio, data_fim, observacao, ativo, criado_em, atualizado_em, criado_por, atualizado_por)
                VALUES (:id, :company, :code, :name, :description, :parentId, :type, :responsibleId, :acceptsEntries, :startDate, :endDate, :notes, :active, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, :actor, :actor)
                RETURNING id
                """ : """
                UPDATE centros_custos SET codigo = :code,
                    nome = :name,
                    descricao = :description,
                    centro_pai_id = :parentId,
                    tipo = :type,
                    responsavel_id = :responsibleId,
                    aceita_lancamento = :acceptsEntries,
                    data_inicio = :startDate,
                    data_fim = :endDate,
                    observacao = :notes,
                    ativo = :active,
                    atualizado_em = CURRENT_TIMESTAMP, atualizado_por = :actor
                 WHERE id = :id AND empresa_id = :company AND excluido_em IS NULL
                RETURNING id
                """;
        return jdbc.sql(sql).param("id", id == null ? UUID.randomUUID() : id)
                .param("company", user.companyId()).param("actor", user.userId())
                .param("code", request.code())
                .param("name", request.name())
                .param("description", request.description())
                .param("parentId", request.parentId())
                .param("type", request.type())
                .param("responsibleId", request.responsibleId())
                .param("acceptsEntries", request.acceptsEntries())
                .param("startDate", request.startDate())
                .param("endDate", request.endDate())
                .param("notes", request.notes())
                .param("active", request.active())
                .query(UUID.class).optional()
                .orElseThrow(() -> new NotFoundException("Cadastro não encontrado."));
    }
}

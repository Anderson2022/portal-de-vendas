package br.com.poolcontrol.financeiro.projetos;

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
public class ProjectRepository {
    private final JdbcClient jdbc;
    private final CurrentUserService user;

    public List<Map<String, Object>> list() {
        return jdbc.sql("""
                SELECT id::text AS id,
                       codigo AS "code",
                       nome AS "name",
                       cliente_id AS "customerId",
                       unidade_id AS "unitId",
                       centro_custo_principal_id AS "costCenterId",
                       responsavel_id AS "responsibleId",
                       tipo AS "type",
                       status AS "status",
                       data_inicio AS "startDate",
                       data_fim_prevista AS "expectedEndDate",
                       data_fim_real AS "actualEndDate",
                       valor_contratado AS "contractAmount",
                       orcamento_custo AS "costBudget",
                       receita_prevista AS "expectedRevenue",
                       descricao AS "description",
                       observacao AS "notes",
                       ativo AS "active",
                       criado_em AS "createdAt", atualizado_em AS "updatedAt",
                       criado_por AS "createdBy", atualizado_por AS "updatedBy"
                  FROM projetos_financeiros WHERE empresa_id = :company
                 ORDER BY codigo
                """).param("company", user.companyId()).query().listOfRows();
    }

    public Long save(Long id, ProjectRequest request) {
        String sql = id == null ? """
                INSERT INTO projetos_financeiros (empresa_id, codigo, nome, cliente_id, unidade_id, centro_custo_principal_id, responsavel_id, tipo, status, data_inicio, data_fim_prevista, data_fim_real, valor_contratado, orcamento_custo, receita_prevista, descricao, observacao, ativo, criado_em, atualizado_em, criado_por, atualizado_por)
                VALUES (:company, :code, :name, :customerId, :unitId, :costCenterId, :responsibleId, :type, :status, :startDate, :expectedEndDate, :actualEndDate, :contractAmount, :costBudget, :expectedRevenue, :description, :notes, :active, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, :actor, :actor)
                RETURNING id
                """ : """
                UPDATE projetos_financeiros SET codigo = :code,
                    nome = :name,
                    cliente_id = :customerId,
                    unidade_id = :unitId,
                    centro_custo_principal_id = :costCenterId,
                    responsavel_id = :responsibleId,
                    tipo = :type,
                    status = :status,
                    data_inicio = :startDate,
                    data_fim_prevista = :expectedEndDate,
                    data_fim_real = :actualEndDate,
                    valor_contratado = :contractAmount,
                    orcamento_custo = :costBudget,
                    receita_prevista = :expectedRevenue,
                    descricao = :description,
                    observacao = :notes,
                    ativo = :active,
                    atualizado_em = CURRENT_TIMESTAMP, atualizado_por = :actor
                 WHERE id = :id AND empresa_id = :company
                RETURNING id
                """;
        return jdbc.sql(sql).param("id", id)
                .param("company", user.companyId()).param("actor", user.userId())
                .param("code", request.code())
                .param("name", request.name())
                .param("customerId", request.customerId())
                .param("unitId", request.unitId())
                .param("costCenterId", request.costCenterId())
                .param("responsibleId", request.responsibleId())
                .param("type", request.type())
                .param("status", request.status())
                .param("startDate", request.startDate())
                .param("expectedEndDate", request.expectedEndDate())
                .param("actualEndDate", request.actualEndDate())
                .param("contractAmount", request.contractAmount())
                .param("costBudget", request.costBudget())
                .param("expectedRevenue", request.expectedRevenue())
                .param("description", request.description())
                .param("notes", request.notes())
                .param("active", request.active())
                .query(Long.class).optional()
                .orElseThrow(() -> new NotFoundException("Cadastro não encontrado."));
    }
}

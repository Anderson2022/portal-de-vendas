package br.com.poolcontrol.financeiro.unidades;

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
public class UnitRepository {
    private final JdbcClient jdbc;
    private final CurrentUserService user;

    public List<Map<String, Object>> list() {
        return jdbc.sql("""
                SELECT id::text AS id,
                       codigo AS "code",
                       nome AS "name",
                       unidade_pai_id AS "parentId",
                       tipo AS "type",
                       responsavel_id AS "responsibleId",
                       cnpj AS "cnpj",
                       cidade AS "city",
                       uf AS "state",
                       endereco AS "address",
                       centro_custo_padrao_id AS "defaultCostCenterId",
                       conta_bancaria_padrao_id AS "defaultBankAccountId",
                       data_inicio AS "startDate",
                       data_fim AS "endDate",
                       observacao AS "notes",
                       ativo AS "active",
                       criado_em AS "createdAt", atualizado_em AS "updatedAt",
                       criado_por AS "createdBy", atualizado_por AS "updatedBy"
                  FROM filiais WHERE empresa_id = :company
                 ORDER BY codigo
                """).param("company", user.companyId()).query().listOfRows();
    }

    public Long save(Long id, UnitRequest request) {
        String sql = id == null ? """
                INSERT INTO filiais (empresa_id, codigo, nome, unidade_pai_id, tipo, responsavel_id, cnpj, cidade, uf, endereco, centro_custo_padrao_id, conta_bancaria_padrao_id, data_inicio, data_fim, observacao, ativo, criado_em, atualizado_em, criado_por, atualizado_por)
                VALUES (:company, :code, :name, :parentId, :type, :responsibleId, :cnpj, :city, :state, :address, :defaultCostCenterId, :defaultBankAccountId, :startDate, :endDate, :notes, :active, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, :actor, :actor)
                RETURNING id
                """ : """
                UPDATE filiais SET codigo = :code,
                    nome = :name,
                    unidade_pai_id = :parentId,
                    tipo = :type,
                    responsavel_id = :responsibleId,
                    cnpj = :cnpj,
                    cidade = :city,
                    uf = :state,
                    endereco = :address,
                    centro_custo_padrao_id = :defaultCostCenterId,
                    conta_bancaria_padrao_id = :defaultBankAccountId,
                    data_inicio = :startDate,
                    data_fim = :endDate,
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
                .param("parentId", request.parentId())
                .param("type", request.type())
                .param("responsibleId", request.responsibleId())
                .param("cnpj", request.cnpj())
                .param("city", request.city())
                .param("state", request.state())
                .param("address", request.address())
                .param("defaultCostCenterId", request.defaultCostCenterId())
                .param("defaultBankAccountId", request.defaultBankAccountId())
                .param("startDate", request.startDate())
                .param("endDate", request.endDate())
                .param("notes", request.notes())
                .param("active", request.active())
                .query(Long.class).optional()
                .orElseThrow(() -> new NotFoundException("Cadastro não encontrado."));
    }
}

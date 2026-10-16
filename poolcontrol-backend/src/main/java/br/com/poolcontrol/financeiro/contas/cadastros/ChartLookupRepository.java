package br.com.poolcontrol.financeiro.contas.cadastros;

import br.com.poolcontrol.shared.exception.BusinessException;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class ChartLookupRepository {
    private final JdbcClient jdbc;
    private final CurrentUserService currentUser;

    // SQL identifiers come exclusively from the server-owned catalog.
    public List<Map<String, Object>> list(ChartLookupDefinition definition) {
        String parent = definition.parentColumn() == null ? "NULL::text" : definition.parentColumn() + "::text";
        return jdbc.sql("SELECT id::text AS id, " + definition.code() + " AS code, "
                + definition.name() + " AS name, " + definition.active() + " AS active, "
                + parent + " AS \"parentId\" FROM " + definition.table()
                + " WHERE " + definition.scope() + " ORDER BY " + definition.code())
                .param("company", currentUser.companyId()).query().listOfRows();
    }

    public Map<String, Object> require(String key, Object id) {
        if (id == null) return Map.of();
        return list(ChartLookupDefinition.find(key)).stream()
                .filter(row -> row.get("id").equals(id.toString())).findFirst()
                .orElseThrow(() -> new BusinessException("Seleção inválida ou de outra empresa: " + key));
    }

    public Map<String, Object> create(String key, CreateChartLookupRequest request) {
        var definition = ChartLookupDefinition.find(key);
        if (!definition.creatable()) throw new BusinessException("Utilize o cadastro de origem para incluir este registro.");
        if (definition.parentKey() != null) {
            if (request.parentId() == null) throw new BusinessException("Selecione primeiro o cadastro superior.");
            require(definition.parentKey(), request.parentId());
        }
        String extraColumn = definition.parentColumn() == null ? "" : ", " + definition.parentColumn();
        String extraValue = definition.parentColumn() == null ? "" : ", :parent";
        try {
            Long id = jdbc.sql("INSERT INTO " + definition.table()
                    + " (empresa_id, codigo, nome" + extraColumn + ") VALUES (:company, :code, :name"
                    + extraValue + ") RETURNING id")
                    .param("company", currentUser.companyId()).param("code", request.code().trim())
                    .param("name", request.name().trim()).param("parent", request.parentId())
                    .query(Long.class).single();
            return require(key, id);
        } catch (DuplicateKeyException exception) {
            throw new BusinessException("Já existe um registro com este código.");
        }
    }
}

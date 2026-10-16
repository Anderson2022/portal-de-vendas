package br.com.poolcontrol.financeiro.contas.integrations;

import br.com.poolcontrol.financeiro.contas.cadastros.ChartLookupRepository;
import br.com.poolcontrol.shared.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import java.util.Map;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class IntegrationSettingsRepository {
    private final JdbcClient jdbc;
    private final ChartLookupRepository lookups;

    public Map<String, Object> get(UUID id) {
        var rows = jdbc.sql("""
                SELECT filial_id AS "branchId",
                       conta_bancaria_id AS "bankAccountId",
                       centro_custo_padrao_id AS "defaultCostCenterId",
                       projeto_padrao_id AS "defaultProjectId",
                       integracao_externa_id AS "externalIntegrationId",
                       conta_externa_id AS "externalAccountId",
                       codigo_externo AS "externalCode",
                       sincroniza_automaticamente AS "autoSync"
                  FROM plano_contas_integracoes WHERE plano_conta_id = :id
                """).param("id", id).query().listOfRows();
        return rows.isEmpty() ? Map.of() : rows.getFirst();
    }

    public void save(UUID id, IntegrationSettingsRequest request) {
        lookups.require("branch", request.branchId());
        lookups.require("bankAccount", request.bankAccountId());
        lookups.require("defaultCostCenter", request.defaultCostCenterId());
        lookups.require("defaultProject", request.defaultProjectId());
        lookups.require("externalIntegration", request.externalIntegrationId());
        lookups.require("externalAccount", request.externalAccountId());
        validateParent("externalAccount", request.externalAccountId(), request.externalIntegrationId());
        if (request.autoSync() && (request.externalIntegrationId() == null || request.externalAccountId() == null)) {
            throw new BusinessException("Informe a integração e a conta externa para habilitar a sincronização.");
        }
        jdbc.sql("""
                INSERT INTO plano_contas_integracoes (
                    plano_conta_id, filial_id, conta_bancaria_id, centro_custo_padrao_id, projeto_padrao_id,
                    integracao_externa_id, conta_externa_id, codigo_externo, sincroniza_automaticamente
                ) VALUES (
                    :id, :branchId, :bankAccountId, :defaultCostCenterId, :defaultProjectId,
                    :externalIntegrationId, :externalAccountId, :externalCode, :autoSync
                ) ON CONFLICT (plano_conta_id) DO UPDATE SET
                    filial_id = EXCLUDED.filial_id,
                    conta_bancaria_id = EXCLUDED.conta_bancaria_id,
                    centro_custo_padrao_id = EXCLUDED.centro_custo_padrao_id,
                    projeto_padrao_id = EXCLUDED.projeto_padrao_id,
                    integracao_externa_id = EXCLUDED.integracao_externa_id,
                    conta_externa_id = EXCLUDED.conta_externa_id,
                    codigo_externo = EXCLUDED.codigo_externo,
                    sincroniza_automaticamente = EXCLUDED.sincroniza_automaticamente
                """).param("id", id)
                .param("branchId", request.branchId())
                .param("bankAccountId", request.bankAccountId())
                .param("defaultCostCenterId", request.defaultCostCenterId())
                .param("defaultProjectId", request.defaultProjectId())
                .param("externalIntegrationId", request.externalIntegrationId())
                .param("externalAccountId", request.externalAccountId())
                .param("externalCode", request.externalCode())
                .param("autoSync", request.autoSync())
                .update();
    }

    private void validateParent(String key, Long child, Long parent) {
        if (child != null && (parent == null || !parent.toString().equals(lookups.require(key, child).get("parentId")))) {
            throw new BusinessException("O registro selecionado não pertence ao cadastro superior informado.");
        }
    }
}

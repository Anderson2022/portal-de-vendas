package br.com.poolcontrol.financeiro.contas.fiscal;

import br.com.poolcontrol.financeiro.contas.cadastros.ChartLookupRepository;
import br.com.poolcontrol.shared.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import java.util.Map;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class FiscalSettingsRepository {
    private final JdbcClient jdbc;
    private final ChartLookupRepository lookups;

    public Map<String, Object> get(UUID id) {
        var rows = jdbc.sql("""
                SELECT conta_referencial_id AS "referenceAccountId",
                       classificacao_sped_id AS "spedClassificationId",
                       codigo_sped AS "spedCode",
                       demonstrativo_id AS "statementId",
                       grupo_demonstrativo_id AS "statementGroupId",
                       conta_encerramento_id AS "closingAccountId",
                       natureza_fiscal_id AS "fiscalNatureId",
                       tipo_resultado_id AS "resultTypeId",
                       aceita_lancamento_manual AS "manualEntries",
                       conta_compensacao AS "compensation"
                  FROM plano_contas_contabil_fiscal WHERE plano_conta_id = :id
                """).param("id", id).query().listOfRows();
        return rows.isEmpty() ? Map.of() : rows.getFirst();
    }

    public void save(UUID id, FiscalSettingsRequest request) {
        lookups.require("referenceAccount", request.referenceAccountId());
        lookups.require("spedClassification", request.spedClassificationId());
        lookups.require("statement", request.statementId());
        lookups.require("statementGroup", request.statementGroupId());
        lookups.require("closingAccount", request.closingAccountId());
        lookups.require("fiscalNature", request.fiscalNatureId());
        lookups.require("resultType", request.resultTypeId());
        if (id.equals(request.closingAccountId())) throw new BusinessException("A conta de encerramento não pode ser a própria conta.");
        validateParent("statementGroup", request.statementGroupId(), request.statementId());
        jdbc.sql("""
                INSERT INTO plano_contas_contabil_fiscal (
                    plano_conta_id, conta_referencial_id, classificacao_sped_id, codigo_sped, demonstrativo_id,
                    grupo_demonstrativo_id, conta_encerramento_id, natureza_fiscal_id, tipo_resultado_id,
                    aceita_lancamento_manual, conta_compensacao
                ) VALUES (
                    :id, :referenceAccountId, :spedClassificationId, :spedCode, :statementId,
                    :statementGroupId, :closingAccountId, :fiscalNatureId, :resultTypeId, :manualEntries,
                    :compensation
                ) ON CONFLICT (plano_conta_id) DO UPDATE SET
                    conta_referencial_id = EXCLUDED.conta_referencial_id,
                    classificacao_sped_id = EXCLUDED.classificacao_sped_id,
                    codigo_sped = EXCLUDED.codigo_sped,
                    demonstrativo_id = EXCLUDED.demonstrativo_id,
                    grupo_demonstrativo_id = EXCLUDED.grupo_demonstrativo_id,
                    conta_encerramento_id = EXCLUDED.conta_encerramento_id,
                    natureza_fiscal_id = EXCLUDED.natureza_fiscal_id,
                    tipo_resultado_id = EXCLUDED.tipo_resultado_id,
                    aceita_lancamento_manual = EXCLUDED.aceita_lancamento_manual,
                    conta_compensacao = EXCLUDED.conta_compensacao
                """).param("id", id)
                .param("referenceAccountId", request.referenceAccountId())
                .param("spedClassificationId", request.spedClassificationId())
                .param("spedCode", request.spedCode())
                .param("statementId", request.statementId())
                .param("statementGroupId", request.statementGroupId())
                .param("closingAccountId", request.closingAccountId())
                .param("fiscalNatureId", request.fiscalNatureId())
                .param("resultTypeId", request.resultTypeId())
                .param("manualEntries", request.manualEntries())
                .param("compensation", request.compensation())
                .update();
    }

    private void validateParent(String key, Long child, Long parent) {
        if (child != null && (parent == null || !parent.toString().equals(lookups.require(key, child).get("parentId")))) {
            throw new BusinessException("O registro selecionado não pertence ao cadastro superior informado.");
        }
    }
}

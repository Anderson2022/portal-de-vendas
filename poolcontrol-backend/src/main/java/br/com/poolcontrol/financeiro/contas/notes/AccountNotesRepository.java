package br.com.poolcontrol.financeiro.contas.notes;

import br.com.poolcontrol.financeiro.contas.cadastros.ChartLookupRepository;
import br.com.poolcontrol.shared.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import java.util.Map;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class AccountNotesRepository {
    private final JdbcClient jdbc;
    private final ChartLookupRepository lookups;

    public Map<String, Object> get(UUID id) {
        var rows = jdbc.sql("""
                SELECT observacao_geral AS "notes",
                       instrucao_lancamento AS "entryInstructions",
                       observacao_contabil AS "accountingNotes",
                       observacao_fiscal AS "fiscalNotes",
                       usuario_responsavel_id AS "responsibleUserId",
                       data_vigencia AS "startDate",
                       data_final AS "endDate"
                  FROM plano_contas_observacoes WHERE plano_conta_id = :id
                """).param("id", id).query().listOfRows();
        return rows.isEmpty() ? Map.of() : rows.getFirst();
    }

    public void save(UUID id, AccountNotesRequest request) {
        lookups.require("responsibleUser", request.responsibleUserId());
        if (request.startDate() != null && request.endDate() != null && request.endDate().isBefore(request.startDate())) {
            throw new BusinessException("A data final não pode ser anterior à data de vigência.");
        }
        jdbc.sql("""
                INSERT INTO plano_contas_observacoes (
                    plano_conta_id, observacao_geral, instrucao_lancamento, observacao_contabil,
                    observacao_fiscal, usuario_responsavel_id, data_vigencia, data_final
                ) VALUES (
                    :id, :notes, :entryInstructions, :accountingNotes, :fiscalNotes, :responsibleUserId,
                    :startDate, :endDate
                ) ON CONFLICT (plano_conta_id) DO UPDATE SET
                    observacao_geral = EXCLUDED.observacao_geral,
                    instrucao_lancamento = EXCLUDED.instrucao_lancamento,
                    observacao_contabil = EXCLUDED.observacao_contabil,
                    observacao_fiscal = EXCLUDED.observacao_fiscal,
                    usuario_responsavel_id = EXCLUDED.usuario_responsavel_id,
                    data_vigencia = EXCLUDED.data_vigencia,
                    data_final = EXCLUDED.data_final
                """).param("id", id)
                .param("notes", request.notes())
                .param("entryInstructions", request.entryInstructions())
                .param("accountingNotes", request.accountingNotes())
                .param("fiscalNotes", request.fiscalNotes())
                .param("responsibleUserId", request.responsibleUserId())
                .param("startDate", request.startDate())
                .param("endDate", request.endDate())
                .update();
    }
}

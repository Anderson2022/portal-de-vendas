package br.com.poolcontrol.financeiro.contas;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class ChartAccountLinks {
    private final JdbcClient jdbc;

    public boolean exists(UUID id) {
        return jdbc.sql("""
                SELECT EXISTS (
                    SELECT 1 FROM plano_contas WHERE conta_pai_id = :id
                    UNION ALL
                    SELECT 1 FROM contas_pagar WHERE plano_conta_id = :id
                    UNION ALL
                    SELECT 1 FROM contas_receber WHERE plano_conta_id = :id
                    UNION ALL
                    SELECT 1 FROM rateios WHERE plano_conta_id = :id
                    UNION ALL
                    SELECT 1 FROM recorrencias_financeiras WHERE plano_conta_id = :id
                    UNION ALL
                    SELECT 1 FROM orcamento_itens WHERE plano_conta_id = :id
                    UNION ALL
                    SELECT 1 FROM plano_contas_contabil_fiscal WHERE conta_encerramento_id = :id
                )
                """).param("id", id).query(Boolean.class).single();
    }
}

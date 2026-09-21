CREATE INDEX idx_saldos_produto_deposito
    ON estoques_saldos (
        empresa_id,
        produto_id,
        deposito_id
    );

CREATE INDEX idx_movimentos_transacao
    ON stock_movements (
        identificador_transacao
    );

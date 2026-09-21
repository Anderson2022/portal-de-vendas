ALTER TABLE stock_movements
    ADD COLUMN location_id BIGINT REFERENCES localizacoes_estoque(id),
    ADD COLUMN lote_id BIGINT REFERENCES lotes_estoque(id),
    ADD COLUMN unit_id BIGINT REFERENCES unidades_medida(id),
    ADD COLUMN quantidade_informada NUMERIC(18,6),
    ADD COLUMN fator_conversao NUMERIC(18,6) NOT NULL DEFAULT 1,
    ADD COLUMN saldo_anterior NUMERIC(18,6),
    ADD COLUMN saldo_posterior NUMERIC(18,6),
    ADD COLUMN numero_serie VARCHAR(160),
    ADD COLUMN identificador_transacao UUID NOT NULL DEFAULT gen_random_uuid();

CREATE TABLE financial_dimension_history (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    dominio VARCHAR(40) NOT NULL,
    registro_id VARCHAR(40) NOT NULL,
    usuario_id BIGINT NOT NULL REFERENCES users(id),
    ocorrido_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dados JSONB NOT NULL
);
CREATE INDEX idx_dimension_history_record
    ON financial_dimension_history (empresa_id, dominio, registro_id, ocorrido_em);

CREATE TABLE estoques_saldos (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    produto_id BIGINT NOT NULL REFERENCES produtos(id),

    deposito_id BIGINT REFERENCES depositos(id),
    localizacao_id BIGINT REFERENCES localizacoes_estoque(id),
    lote_id BIGINT REFERENCES lotes_estoque(id),

    quantidade_fisica NUMERIC(18,6) NOT NULL DEFAULT 0,
    quantidade_reservada NUMERIC(18,6) NOT NULL DEFAULT 0,
    quantidade_bloqueada NUMERIC(18,6) NOT NULL DEFAULT 0,
    quantidade_em_transito NUMERIC(18,6) NOT NULL DEFAULT 0,
    quantidade_terceiros NUMERIC(18,6) NOT NULL DEFAULT 0,
    quantidade_em_poder_terceiros NUMERIC(18,6) NOT NULL DEFAULT 0,

    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE NULLS NOT DISTINCT (
        empresa_id,
        produto_id,
        deposito_id,
        localizacao_id,
        lote_id
    ),

    CHECK (
        quantidade_reservada >= 0
        AND quantidade_bloqueada >= 0
        AND quantidade_em_transito >= 0
    )
);

CREATE TABLE inventario_itens (
    id BIGSERIAL PRIMARY KEY,

    inventario_id BIGINT NOT NULL
        REFERENCES inventarios(id)
        ON DELETE CASCADE,

    produto_id BIGINT NOT NULL REFERENCES produtos(id),
    deposito_id BIGINT NOT NULL REFERENCES depositos(id),

    localizacao_id BIGINT REFERENCES localizacoes_estoque(id),

    lote VARCHAR(100),
    numero_serie VARCHAR(160),

    unidade_medida_id BIGINT REFERENCES unidades_medida(id),

    saldo_sistema NUMERIC(18,6) NOT NULL,
    quantidade_aprovada NUMERIC(18,6),
    divergencia NUMERIC(18,6),

    status_item VARCHAR(30) NOT NULL DEFAULT 'PENDENTE',

    motivo_divergencia VARCHAR(180),
    observacao TEXT,

    UNIQUE (
        inventario_id,
        produto_id,
        localizacao_id,
        lote,
        numero_serie
    )
);

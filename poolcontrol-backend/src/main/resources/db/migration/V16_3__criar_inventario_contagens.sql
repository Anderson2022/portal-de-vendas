CREATE TABLE inventario_contagens (
    id BIGSERIAL PRIMARY KEY,

    inventario_item_id BIGINT NOT NULL
        REFERENCES inventario_itens(id)
        ON DELETE CASCADE,

    numero_contagem INTEGER NOT NULL,

    quantidade NUMERIC(18,6) NOT NULL
        CHECK (quantidade >= 0),

    usuario_id BIGINT NOT NULL REFERENCES users(id),

    data_hora TIMESTAMPTZ NOT NULL DEFAULT now(),

    observacao TEXT,

    UNIQUE (
        inventario_item_id,
        numero_contagem
    )
);

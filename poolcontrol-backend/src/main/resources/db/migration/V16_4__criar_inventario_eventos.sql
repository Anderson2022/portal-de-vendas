CREATE TABLE inventario_eventos (
    id BIGSERIAL PRIMARY KEY,

    inventario_id BIGINT NOT NULL
        REFERENCES inventarios(id)
        ON DELETE CASCADE,

    status VARCHAR(30) NOT NULL,

    usuario_id BIGINT NOT NULL REFERENCES users(id),

    descricao TEXT,

    criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

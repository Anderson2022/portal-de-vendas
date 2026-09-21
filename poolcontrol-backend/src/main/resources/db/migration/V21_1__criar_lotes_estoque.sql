CREATE TABLE lotes_estoque (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    produto_id BIGINT NOT NULL REFERENCES produtos(id),

    codigo VARCHAR(100) NOT NULL,
    validade DATE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (empresa_id, produto_id, codigo)
);

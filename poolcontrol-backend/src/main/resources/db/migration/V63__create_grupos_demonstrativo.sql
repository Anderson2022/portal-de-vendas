CREATE TABLE grupos_demonstrativo (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    codigo VARCHAR(40) NOT NULL,
    nome VARCHAR(180) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    demonstrativo_id BIGINT NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id, empresa_id),
    UNIQUE (empresa_id, codigo),
    FOREIGN KEY (demonstrativo_id, empresa_id) REFERENCES demonstrativos_contabeis (id, empresa_id)
);

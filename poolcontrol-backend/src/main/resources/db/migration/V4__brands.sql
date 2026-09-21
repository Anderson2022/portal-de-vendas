CREATE TABLE IF NOT EXISTS marcas (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    endereco_id BIGINT,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    logo_url VARCHAR(500),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL,
    atualizado_em TIMESTAMP NOT NULL,
    CONSTRAINT uk_marcas_empresa_nome UNIQUE (empresa_id, nome)
);

CREATE INDEX IF NOT EXISTS idx_marcas_empresa_ativo ON marcas (empresa_id, ativo);

-- Migration V6_8__criar_tensoes_produto.sql
-- Parte da V6: normalizacao dos detalhes de produto.

CREATE TABLE tensoes_produto (
    id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), nome VARCHAR(60) NOT NULL, codigo VARCHAR(20) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE, UNIQUE (empresa_id, codigo)
);

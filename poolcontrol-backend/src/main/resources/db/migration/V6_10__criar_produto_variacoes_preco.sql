-- Migration V6_10__criar_produto_variacoes_preco.sql
-- Parte da V6: normalizacao dos detalhes de produto.

CREATE TABLE produto_variacoes_preco (
    id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), produto_id BIGINT NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    descricao VARCHAR(160) NOT NULL, quantidade_minima NUMERIC(14,3) NOT NULL, preco NUMERIC(14,2) NOT NULL
);

-- Migration V6_7__criar_produto_midia.sql
-- Parte da V6: normalizacao dos detalhes de produto.

CREATE TABLE produto_midia (
    id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), produto_id BIGINT NOT NULL UNIQUE REFERENCES produtos(id) ON DELETE CASCADE,
    imagem TEXT, observacoes_internas TEXT, orientacoes_venda_instalacao TEXT
);

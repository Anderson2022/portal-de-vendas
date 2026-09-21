-- Migration V6_11__criar_produto_componentes_kit.sql
-- Parte da V6: normalizacao dos detalhes de produto.

CREATE TABLE produto_componentes_kit (
    id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), produto_id BIGINT NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    componente_produto_id BIGINT REFERENCES produtos(id), descricao VARCHAR(200) NOT NULL, quantidade NUMERIC(14,3) NOT NULL, unidade VARCHAR(20) NOT NULL
);

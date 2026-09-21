-- Migration V6_1__criar_produto_identificacao.sql
-- Parte da V6: normalizacao dos detalhes de produto.

CREATE TABLE produto_identificacao (
    id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), produto_id BIGINT NOT NULL UNIQUE REFERENCES produtos(id) ON DELETE CASCADE,
    codigo_interno VARCHAR(60), referencia_fabricante VARCHAR(120)
);

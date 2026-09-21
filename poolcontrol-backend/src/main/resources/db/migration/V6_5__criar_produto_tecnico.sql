-- Migration V6_5__criar_produto_tecnico.sql
-- Parte da V6: normalizacao dos detalhes de produto.

CREATE TABLE produto_tecnico (
    id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), produto_id BIGINT NOT NULL UNIQUE REFERENCES produtos(id) ON DELETE CASCADE,
    compatibilidade VARCHAR(500), assistencia_tecnica VARCHAR(500), garantia_geral_meses INTEGER, link_manual VARCHAR(1000)
);

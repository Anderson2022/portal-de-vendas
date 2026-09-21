-- Migration V6_4__criar_produto_fiscal.sql
-- Parte da V6: normalizacao dos detalhes de produto.

CREATE TABLE produto_fiscal (
    id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), produto_id BIGINT NOT NULL UNIQUE REFERENCES produtos(id) ON DELETE CASCADE,
    ncm VARCHAR(8), cest VARCHAR(7), origem_mercadoria VARCHAR(120), cfop_venda VARCHAR(4), codigo_icms VARCHAR(3),
    codigo_pis VARCHAR(2), codigo_cofins VARCHAR(2), codigo_ipi VARCHAR(2), gtin_tributavel VARCHAR(14),
    fator_conversao_tributavel NUMERIC(18,6), codigo_beneficio_fiscal VARCHAR(30)
);

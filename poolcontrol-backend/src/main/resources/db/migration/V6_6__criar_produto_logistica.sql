-- Migration V6_6__criar_produto_logistica.sql
-- Parte da V6: normalizacao dos detalhes de produto.

CREATE TABLE produto_logistica (
    id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), produto_id BIGINT NOT NULL UNIQUE REFERENCES produtos(id) ON DELETE CASCADE,
    codigo_fornecedor VARCHAR(120), unidades_por_embalagem NUMERIC(14,3), prazo_reposicao_dias INTEGER,
    pedido_minimo_compra NUMERIC(14,3), peso_liquido NUMERIC(14,3), peso_bruto NUMERIC(14,3),
    comprimento_embalagem NUMERIC(14,2), largura_embalagem NUMERIC(14,2), altura_embalagem NUMERIC(14,2), condicoes_armazenamento VARCHAR(1000)
);

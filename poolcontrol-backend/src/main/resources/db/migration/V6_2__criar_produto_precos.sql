-- Migration V6_2__criar_produto_precos.sql
-- Parte da V6: normalizacao dos detalhes de produto.

CREATE TABLE produto_precos (
    id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), produto_id BIGINT NOT NULL UNIQUE REFERENCES produtos(id) ON DELETE CASCADE,
    preco_minimo NUMERIC(14,2), preco_promocional NUMERIC(14,2), promocao_inicio DATE, promocao_fim DATE,
    margem_minima NUMERIC(7,2), desconto_maximo NUMERIC(7,2), comissao NUMERIC(7,2), quantidade_minima_venda NUMERIC(14,3)
);

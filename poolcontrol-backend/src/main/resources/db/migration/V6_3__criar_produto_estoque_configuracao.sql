-- Migration V6_3__criar_produto_estoque_configuracao.sql
-- Parte da V6: normalizacao dos detalhes de produto.

CREATE TABLE produto_estoque_configuracao (
    id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), produto_id BIGINT NOT NULL UNIQUE REFERENCES produtos(id) ON DELETE CASCADE,
    estoque_maximo NUMERIC(14,3), ponto_reposicao NUMERIC(14,3), localizacao VARCHAR(160),
    controla_lote BOOLEAN NOT NULL DEFAULT FALSE, controla_validade BOOLEAN NOT NULL DEFAULT FALSE,
    controla_serie BOOLEAN NOT NULL DEFAULT FALSE, controla_estoque BOOLEAN NOT NULL DEFAULT TRUE,
    exibir_venda BOOLEAN NOT NULL DEFAULT TRUE, permite_venda_fracionada BOOLEAN NOT NULL DEFAULT FALSE,
    exige_instalacao BOOLEAN NOT NULL DEFAULT FALSE
);

-- Migration V6_9__criar_produto_especificacoes.sql
-- Parte da V6: normalizacao dos detalhes de produto.

CREATE TABLE produto_especificacoes (
    id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), produto_id BIGINT NOT NULL UNIQUE REFERENCES produtos(id) ON DELETE CASCADE,
    tensao_id BIGINT REFERENCES tensoes_produto(id), potencia VARCHAR(80), garantia_meses INTEGER,
    modelo_piscina VARCHAR(160), comprimento NUMERIC(14,3), largura NUMERIC(14,3), profundidade NUMERIC(14,3), volume NUMERIC(14,3), cor VARCHAR(80),
    modelo_filtro VARCHAR(160), vazao VARCHAR(80), tamanho_embalagem VARCHAR(80), concentracao VARCHAR(80), principio_ativo VARCHAR(200), modo_aplicacao VARCHAR(500)
);

ALTER TABLE tipos_produto
ADD COLUMN produto_fisico BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN controla_estoque BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN permite_compra BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN permite_venda BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN controla_lote BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN controla_validade BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN controla_serie BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN codigo_tipo_item_fiscal VARCHAR(20);

CREATE INDEX idx_tipos_produto_empresa_ativo ON tipos_produto (empresa_id, active);

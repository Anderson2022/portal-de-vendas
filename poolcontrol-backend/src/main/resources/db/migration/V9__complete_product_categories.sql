ALTER TABLE categorias_produto
    ADD COLUMN categoria_pai_id BIGINT REFERENCES categorias_produto(id),
    ADD COLUMN descricao_seo VARCHAR(320),
    ADD COLUMN imagem_capa TEXT;

CREATE INDEX idx_categorias_produto_empresa_pai ON categorias_produto (empresa_id, categoria_pai_id);

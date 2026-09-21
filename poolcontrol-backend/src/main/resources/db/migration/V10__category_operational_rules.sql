ALTER TABLE categorias_produto
    ADD COLUMN codigo VARCHAR(40),
    ADD COLUMN nivel INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN ordem_exibicao INTEGER,
    ADD COLUMN controla_lote BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN controla_validade BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN controla_serie BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN permite_estoque_negativo BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN estoque_minimo_padrao NUMERIC(14,3),
    ADD COLUMN estoque_maximo_padrao NUMERIC(14,3),
    ADD COLUMN estoque_seguranca_padrao NUMERIC(14,3),
    ADD COLUMN metodo_saida_padrao VARCHAR(10),
    ADD COLUMN dias_sem_movimento INTEGER,
    ADD COLUMN codigo_externo VARCHAR(100),
    ADD COLUMN observacoes TEXT,
    ADD COLUMN criado_por BIGINT REFERENCES users(id),
    ADD COLUMN alterado_por BIGINT REFERENCES users(id);

UPDATE categorias_produto SET codigo='CAT-' || lpad(id::text, 3, '0') WHERE codigo IS NULL;
ALTER TABLE categorias_produto ALTER COLUMN codigo SET NOT NULL;
ALTER TABLE categorias_produto ADD CONSTRAINT uk_categoria_empresa_codigo UNIQUE (empresa_id, codigo);
ALTER TABLE categorias_produto ADD CONSTRAINT ck_categoria_metodo_saida CHECK (metodo_saida_padrao IS NULL OR metodo_saida_padrao IN ('FIFO','FEFO'));

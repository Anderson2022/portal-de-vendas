ALTER TABLE filiais
    ADD COLUMN unidade_pai_id BIGINT,
    ADD COLUMN tipo VARCHAR(30) NOT NULL DEFAULT 'FILIAL',
    ADD COLUMN responsavel_id BIGINT REFERENCES users(id),
    ADD COLUMN cnpj VARCHAR(18),
    ADD COLUMN cidade VARCHAR(120),
    ADD COLUMN uf VARCHAR(2),
    ADD COLUMN endereco TEXT,
    ADD COLUMN centro_custo_padrao_id UUID REFERENCES centros_custos(id),
    ADD COLUMN conta_bancaria_padrao_id UUID REFERENCES contas_bancarias(id),
    ADD COLUMN data_inicio DATE,
    ADD COLUMN data_fim DATE,
    ADD COLUMN observacao TEXT,
    ADD COLUMN criado_por BIGINT REFERENCES users(id),
    ADD COLUMN atualizado_por BIGINT REFERENCES users(id),
    ADD CONSTRAINT fk_unidade_pai_empresa FOREIGN KEY (unidade_pai_id, empresa_id)
        REFERENCES filiais(id, empresa_id),
    ADD CONSTRAINT ck_unidade_validade CHECK (data_fim IS NULL OR data_inicio IS NULL OR data_fim >= data_inicio);

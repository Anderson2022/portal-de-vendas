ALTER TABLE centros_custos
    ADD COLUMN descricao TEXT,
    ADD COLUMN tipo VARCHAR(30) NOT NULL DEFAULT 'OPERACIONAL',
    ADD COLUMN responsavel_id BIGINT REFERENCES users(id),
    ADD COLUMN aceita_lancamento BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN data_inicio DATE,
    ADD COLUMN data_fim DATE,
    ADD COLUMN observacao TEXT,
    ADD COLUMN criado_por BIGINT REFERENCES users(id),
    ADD COLUMN atualizado_por BIGINT REFERENCES users(id),
    ADD CONSTRAINT uk_centro_empresa_codigo UNIQUE (empresa_id, codigo),
    ADD CONSTRAINT uk_centro_id_empresa UNIQUE (id, empresa_id),
    ADD CONSTRAINT fk_centro_pai_empresa FOREIGN KEY (centro_pai_id, empresa_id)
        REFERENCES centros_custos(id, empresa_id),
    ADD CONSTRAINT ck_centro_validade CHECK (data_fim IS NULL OR data_inicio IS NULL OR data_fim >= data_inicio);

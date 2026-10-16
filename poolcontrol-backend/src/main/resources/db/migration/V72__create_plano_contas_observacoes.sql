CREATE TABLE plano_contas_observacoes (
    plano_conta_id UUID PRIMARY KEY REFERENCES plano_contas(id),
    observacao_geral TEXT,
    instrucao_lancamento TEXT,
    observacao_contabil TEXT,
    observacao_fiscal TEXT,
    usuario_responsavel_id BIGINT REFERENCES users(id),
    data_vigencia DATE,
    data_final DATE,
    CHECK (data_final IS NULL OR data_vigencia IS NULL OR data_final >= data_vigencia)
);

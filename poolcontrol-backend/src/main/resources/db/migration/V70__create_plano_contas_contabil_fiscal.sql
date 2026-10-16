CREATE TABLE plano_contas_contabil_fiscal (
    plano_conta_id UUID PRIMARY KEY REFERENCES plano_contas(id),
    conta_referencial_id BIGINT REFERENCES contas_referenciais(id),
    classificacao_sped_id BIGINT REFERENCES classificacoes_sped(id),
    codigo_sped VARCHAR(60),
    demonstrativo_id BIGINT REFERENCES demonstrativos_contabeis(id),
    grupo_demonstrativo_id BIGINT REFERENCES grupos_demonstrativo(id),
    conta_encerramento_id UUID REFERENCES plano_contas(id),
    natureza_fiscal_id BIGINT REFERENCES naturezas_fiscais(id),
    tipo_resultado_id BIGINT REFERENCES tipos_resultado(id),
    aceita_lancamento_manual BOOLEAN NOT NULL DEFAULT FALSE,
    conta_compensacao BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_plano_contas_contabil_fiscal_encerramento
    ON plano_contas_contabil_fiscal (conta_encerramento_id);

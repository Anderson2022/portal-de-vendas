ALTER TABLE plano_contas
    ADD COLUMN codigo_reduzido VARCHAR(20),
    ADD COLUMN nivel INTEGER,
    ADD COLUMN tipo_conta_id BIGINT REFERENCES tipos_conta_contabil(id),
    ADD COLUMN natureza_id BIGINT REFERENCES naturezas_contabeis(id),
    ADD COLUMN grupo_id BIGINT REFERENCES grupos_contabeis(id),
    ADD COLUMN subgrupo_id BIGINT REFERENCES subgrupos_contabeis(id),
    ADD COLUMN aceita_lancamento BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN permite_centro_custo BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN exige_historico BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE plano_contas ALTER COLUMN id SET DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX uk_plano_contas_empresa_codigo ON plano_contas (empresa_id, codigo);
CREATE INDEX idx_plano_contas_empresa_pai ON plano_contas (empresa_id, conta_pai_id);

ALTER TABLE plano_contas ALTER COLUMN sintetica SET DEFAULT FALSE;
ALTER TABLE plano_contas ALTER COLUMN natureza SET DEFAULT 'DEVEDORA';

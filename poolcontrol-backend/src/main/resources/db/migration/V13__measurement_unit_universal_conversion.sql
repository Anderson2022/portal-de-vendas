ALTER TABLE unidades_medida
    ADD COLUMN unidade_base_id BIGINT NULL REFERENCES unidades_medida(id),
    ADD COLUMN fator_conversao NUMERIC(18,6) NOT NULL DEFAULT 1;

ALTER TABLE unidades_medida
    ADD CONSTRAINT ck_unidade_medida_fator CHECK (fator_conversao > 0),
    ADD CONSTRAINT ck_unidade_medida_base_diferente CHECK (unidade_base_id IS NULL OR unidade_base_id <> id),
    ADD CONSTRAINT ck_unidade_medida_propria_fator CHECK (unidade_base_id IS NOT NULL OR fator_conversao = 1);

CREATE INDEX idx_unidades_medida_base ON unidades_medida (empresa_id, unidade_base_id);

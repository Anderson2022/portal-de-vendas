CREATE TABLE centro_custo_orcamento (
    id UUID PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    centro_custo_id UUID NOT NULL,
    competencia DATE NOT NULL CHECK (EXTRACT(DAY FROM competencia) = 1),
    valor_orcado NUMERIC(18, 2) NOT NULL CHECK (valor_orcado >= 0),
    valor_revisado NUMERIC(18, 2) CHECK (valor_revisado >= 0),
    observacao TEXT,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (empresa_id, centro_custo_id, competencia),
    FOREIGN KEY (centro_custo_id, empresa_id) REFERENCES centros_custos(id, empresa_id)
);

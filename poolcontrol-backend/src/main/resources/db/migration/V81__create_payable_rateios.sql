CREATE TABLE payable_rateios (
    id UUID PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    lancamento_id BIGINT NOT NULL,
    centro_custo_id UUID NOT NULL,
    percentual NUMERIC(7, 4) NOT NULL CHECK (percentual > 0 AND percentual <= 100),
    valor NUMERIC(18, 2) NOT NULL CHECK (valor >= 0),
    UNIQUE (lancamento_id, centro_custo_id),
    FOREIGN KEY (lancamento_id, empresa_id) REFERENCES accounts_payable(id, empresa_id) ON DELETE CASCADE,
    FOREIGN KEY (centro_custo_id, empresa_id) REFERENCES centros_custos(id, empresa_id)
);

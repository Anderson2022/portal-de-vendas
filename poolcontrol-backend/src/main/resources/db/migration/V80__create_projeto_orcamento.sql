CREATE TABLE projeto_orcamento (
    id UUID PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    projeto_id BIGINT NOT NULL,
    plano_conta_id UUID NOT NULL REFERENCES plano_contas(id),
    centro_custo_id UUID NOT NULL REFERENCES centros_custos(id),
    valor_orcado NUMERIC(18, 2) NOT NULL CHECK (valor_orcado >= 0),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (empresa_id, projeto_id, plano_conta_id, centro_custo_id),
    FOREIGN KEY (projeto_id, empresa_id) REFERENCES projetos_financeiros(id, empresa_id)
);

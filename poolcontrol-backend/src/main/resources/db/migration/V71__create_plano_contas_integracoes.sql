CREATE TABLE plano_contas_integracoes (
    plano_conta_id UUID PRIMARY KEY REFERENCES plano_contas(id),
    filial_id BIGINT REFERENCES filiais(id),
    conta_bancaria_id UUID REFERENCES contas_bancarias(id),
    centro_custo_padrao_id UUID REFERENCES centros_custos(id),
    projeto_padrao_id BIGINT REFERENCES projetos_financeiros(id),
    integracao_externa_id BIGINT REFERENCES integracoes_externas(id),
    conta_externa_id BIGINT REFERENCES contas_externas(id),
    codigo_externo VARCHAR(100),
    sincroniza_automaticamente BOOLEAN NOT NULL DEFAULT FALSE
);

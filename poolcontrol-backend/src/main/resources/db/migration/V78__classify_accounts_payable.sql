ALTER TABLE accounts_payable
    ADD COLUMN plano_conta_id UUID REFERENCES plano_contas(id),
    ADD COLUMN centro_custo_id UUID REFERENCES centros_custos(id),
    ADD COLUMN unidade_id BIGINT,
    ADD COLUMN projeto_id BIGINT,
    ADD COLUMN natureza_financeira_id UUID,
    ADD CONSTRAINT fk_payable_unidade_empresa FOREIGN KEY (unidade_id, empresa_id) REFERENCES filiais(id, empresa_id),
    ADD CONSTRAINT fk_payable_projeto_empresa FOREIGN KEY (projeto_id, empresa_id) REFERENCES projetos_financeiros(id, empresa_id),
    ADD CONSTRAINT fk_payable_natureza_empresa FOREIGN KEY (natureza_financeira_id, empresa_id) REFERENCES naturezas_financeiras(id, empresa_id),
    ADD CONSTRAINT uk_payable_id_empresa UNIQUE (id, empresa_id);
CREATE INDEX idx_payable_dimensoes ON accounts_payable (empresa_id, unidade_id, projeto_id, centro_custo_id);

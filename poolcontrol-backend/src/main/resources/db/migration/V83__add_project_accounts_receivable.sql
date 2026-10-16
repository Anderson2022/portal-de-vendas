ALTER TABLE accounts_receivable
    ADD COLUMN projeto_id BIGINT,
    ADD CONSTRAINT fk_receivable_projeto_empresa
        FOREIGN KEY (projeto_id, empresa_id) REFERENCES projetos_financeiros(id, empresa_id);
CREATE INDEX idx_receivable_project ON accounts_receivable (empresa_id, projeto_id);
